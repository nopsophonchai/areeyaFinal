from flask import Flask, request, jsonify
import sendmessage
from constants import *
import time
import threading
from flask_socketio import SocketIO
from testTyphoon import *
from dummyGeofence import geofence

app = Flask(__name__)
socketio = SocketIO(app)

talkMode = False
alerted = False



@app.route('/webhook', methods=['POST'])
def webhook():
    global talkMode
    global alerted
    data = request.json
    events = data.get('events', [])
    
    for event in events:
        print('\n')
        print(event)
        if event['type'] == 'message':
            user_id = event['source']['userId']
            if event['source']['type'] == 'group':
                groupId = event['source']['groupId']
            if event['message']['type'] == 'text':
                message = event['message']['text']
                print(f"User ID: {user_id}, Message: {message}")
                if talkMode:
                    if message.lower() == 'bye':
                        talkMode = False
                    else:
                        sentMessage = talk(message)
                        sendmessage.sendmsg(sentMessage, user_id)
                else:
                    if message.lower() == 'talk':
                        talkMode = True
                    if message.lower() == 'setup' and groupId:
                        sendmessage.sendmsg(f'192.168.1.100:3000?groupId=${groupId}', groupId)
 
            elif event['message']['type'] == 'location':
                latitude = event['message']['latitude']
                longitude = event['message']['longitude']
                isInside = geofence(latitude,longitude)[0]
                print(f"Received GPS coordinates from {user_id}: ({latitude}, {longitude})")
                print(f'User Inside: {isInside}')
                if not isInside:    
                    print('Not inside')
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



if __name__ == '__main__':
    app.run(host='0.0.0.0',port=4242)
