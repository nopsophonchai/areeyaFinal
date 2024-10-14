from flask import Flask, request, jsonify
import sendmessage

app = Flask(__name__)

@app.route('/webhook', methods=['POST'])
def webhook():
    data = request.json  
    events = data.get('events', [])

    for event in events:
        if event['type'] == 'message':
            user_id = event['source']['userId'] 
            message = event['message']['text']   
            print(f"User ID: {user_id}, Message: {message}")
            if message == 'hi':
                sendmessage.sendmsg('hello!')

    return jsonify(status=200)

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=4242)
