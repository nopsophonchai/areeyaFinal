from flask import Flask, send_from_directory, request, jsonify
import sendmessage
from constants import *
import os
import time
import threading
from flask_socketio import SocketIO
from testTyphoon import *
# from dummyGeofence import geofence
from flask_cors import CORS
from areeyaBase import supabase

app = Flask(__name__, static_folder="my-app/build", static_url_path="")

socketio = SocketIO(app)
CORS(app)

talkMode = False
alerted = False

ngrokURL = 'areeya.ngrok.app'





@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    print(f"Requested path: {path}")  # Debugging
    if path and os.path.exists(f"my-app/build/{path}"):
        return send_from_directory("my-app/build", path)
    # Fallback to index.html for React Router paths
    print("Serving index.html for React route")
    return send_from_directory("my-app/build", "index.html")


@app.errorhandler(404)
def catch_all_404(e):
    """Catch all 404 errors and serve React app."""
    print(f"Fallback to React: Requested path was {request.path}")
    return send_from_directory("my-app/build", "index.html")


@app.route('/upload', methods=['POST'])
def upload():
    data = request.get_json()
    name = data['name']
    age = data['age']
    mac = data['mac']
    user_id = data['userID']
    gender = data['gender']
    print(user_id)
    response = supabase.table("clients").insert({
            "userID": str(user_id),
            "age": int(age),
            "tagMac": str(mac),
            "patient": str(name),
            "gender": str(gender)
        }).execute()

    # response = supabase.table("clients").select("*").execute()
    # print(response.data)
    return jsonify({"message": "Data uploaded to Supabase successfully!"}), 201

@app.route('/webhook', methods=['POST'])
def webhook():
    global talkMode
    global alerted
    data = request.json
    events = data.get('events', [])
    
    for event in events:
        print('\n')
        print(event)
        # if event['source']['userId']:

        if event['type'] == 'message':
            user_id = event['source']['userId']
            print(user_id)
            match event['message']['text'].lower():
                case 'setup':
                    setup_url = f"{ngrokURL}/?userID={user_id}"
                    sendmessage.sendmsg(f"Please click on this link to start your journey, if you have any questions, feel free to type 'help' to see my commands:\nhttps://{setup_url}", user_id)
                case 'help':
                    sendmessage.sendmsg(f"Here are the list of commands!\n'talk': Enable/Disable conversation mode\n'report':Weekly report (Unavailable in first two weeks)\n'numbers':Emergency numbers in Thailand", user_id)
                case 'report':
                    sendmessage.sendmsg(f"Here is this week's report!\nhttps://{ngrokURL}/Summary",user_id)
                case 'numbers':
                    sendmessage.sendmsg(f"Ambulance : 1669\nFire : 199\nGovernment : 1111\nPolice : 191.", user_id)
                case 'talk':
                    if not talkMode:
                        talkMode = True
                        sendmessage.sendmsg(f"Conversation mode on! Tell me anything!",user_id)
                    else:
                        talkMode = False
                        sendmessage.sendmsg(f"Conversation mode off!",user_id)
                case default:
                    if talkMode:
                        sentMessage = talk(event['message']['text'])
                        sendmessage.sendmsg(sentMessage, user_id)




            # if event['source']['type'] == 'group':
            #     groupId = event['source']['groupId']
            # if event['message']['type'] == 'text':
            #     message = event['message']['text']
            #     print(f"User ID: {user_id}, Message: {message}")
            #     if talkMode:
            #         if message.lower() == 'bye':
            #             talkMode = False
            #         else:
            #             sentMessage = talk(message)
            #             sendmessage.sendmsg(sentMessage, user_id)
            #     else:
            #         if message.lower() == 'talk':
            #             talkMode = True
            #         if message.lower() == 'setup' and groupId:
            #             sendmessage.sendmsg(f'192.168.1.100:3000?groupId=${groupId}', groupId)
 
            # elif event['message']['type'] == 'location':
            #     latitude = event['message']['latitude']
            #     longitude = event['message']['longitude']
            #     isInside = geofence(latitude,longitude)[0]
            #     print(f"Received GPS coordinates from {user_id}: ({latitude}, {longitude})")
            #     print(f'User Inside: {isInside}')
            #     if not isInside:    
            #         print('Not inside')

    return jsonify(status=200)

@app.route(f'/getmembers', methods=['GET'])
def getmembers():
    groupID = request.args.get('groupID')
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {CHANNEL_ACCESS_TOKEN}',
    }
    response = requests.get(
        f'https://api.line.me/v2/bot/group/{groupID}/members/ids',
        headers=headers
    )
    # response = requests.get(
    # f'https://api.line.me/v2/bot/profile/{USER_ID}',  # Replace {userId} with a valid user ID or bot ID
    # headers={'Authorization': f'Bearer {CHANNEL_ACCESS_TOKEN}'}
    # )
    # print(response.status_code, response.json())

    if response.status_code == 200:
        return jsonify(response.json())  
    else:
        return jsonify({'error': 'Failed to fetch data from LINE API', 'status_code': response.status_code}), response.status_code



@app.route(f'/signal', methods=['POST'])
def signal():
    # try:
    data = request.json
    response = supabase.table("clients").select("*").execute()
    tag = data['tag']
    signal = data['message']
    room = 'living room'
    for i in response.data:
        if i['tagMac'] == tag:
            match signal:
                case 'Fall':
                    sendmessage.sendmsg(f"{i['patient']} fell in the {room}. Please check up on them immedietly!", i['userID'])
                case 'Walk':
                    sendmessage.sendmsg(f"I have detected that {i['patient']}'s average walking speed this month has decreased by 50% when compared to his overall average. This is quite concerning, please take them for checkup.", i['userID'])
                case 'leave':
                    sendmessage.sendmsg(f"{i['patient']} has left the house during an abnormal time! Please contact them!", i['userID'])
                case 'still':
                    sendmessage.sendmsg(f"{i['patient']} has stood still in the {room} for 15 minutes, please check up on them",i['userID'])
                case 'help':
                    sendmessage.sendmsg(f"{i['patient']} has signified that they needed help! Please check up on them!", i['userID'])
                case 'report':
                    sendmessage.sendmsg(f"This is this week's report\nhttps://{ngrokURL}/Summary",i['userID'])
                case 'Cough':
                    if i['gender'] == 'Male':
                        sendmessage.sendmsg(f"{i['patient']} has coughed more than 29 times today, according to the European Respiratory Journal, this is higher than the average coughs a healthy male would have.",i['userID'])
                    if i['gender'] == 'Female':
                        sendmessage.sendmsg(f"{i['patient']} has coughed more than 18 times today, according to the European Respiratory Journal, this is higher than the average coughs a healthy female would have.",i['userID'])
    return jsonify({"status": "success"}), 200
    # except:
    #     print('error')
    #     return jsonify({"status": "Error"}), 405
    # data = request.json
    # print(data['message'])
    # signal = data['message']
    # room = 'living room'
    # name = 'Mike'
    # match signal:
    #     case 'Fall':
    #         sendmessage.sendmsg(f'{name} fell in the {room}. Please check up on them immedietly!', USER_ID)
    #     case 'Walk':
    #         sendmessage.sendmsg(f"I have detected that {name}'s average walking speed this month has decreased by 50% when compared to his overall average. This is quite concerning, please take them for checkup.", USER_ID)
    #     case 'leave':
    #         sendmessage.sendmsg(f"{name} has left the house without notifying me. Please contact them!", USER_ID)
    #     case 'still':
    #         sendmessage.sendmsg(f"{name} has stood still in the {room} for 15 minutes, please check up on them",USER_ID)
    #     case 'help':
    #         sendmessage.sendmsg(f'{name} has signified that they needed help! Please check up on them!', USER_ID)
    

@app.route(f'/trybase', methods=['GET'])
def base():
    response = supabase.table("clients").select("*").execute()
    print(response.data)
    return jsonify(status=200,pulledData = response.data)







if __name__ == '__main__':
    app.run(host='0.0.0.0',port=4242)


