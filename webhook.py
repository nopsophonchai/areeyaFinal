from flask import Flask, request, jsonify
import sendmessage
from constants import *
import time
import threading

app = Flask(__name__)

def timedMessage():
    
    while True:
        currentTime = time.time()
        currentTime = time.strftime('%H:%M:%S', time.localtime(currentTime))
        # print(currentTime)
        if currentTime == '09:51:30':
            sendmessage.sendmsg('Have you ate anything?',AMAL_ID)
            

timedThread = threading.Thread(target=timedMessage)
timedThread.start()

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
                sendmessage.sendmsg('hello!',USER_ID)
        

    return jsonify(status=200)

if __name__ == '__main__':
    app.run(host='0.0.0.0',port=4242)
