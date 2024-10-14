import requests
import json
from constants import *

def sendmsg(message):
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {CHANNEL_ACCESS_TOKEN}',
    }


    data = {
        "to": USER_ID,
        "messages": [
            {
                "type": "text",
                "text": f"{message}"
            }
        ]
    }

    response = requests.post(
        'https://api.line.me/v2/bot/message/push',
        headers=headers,
        data=json.dumps(data)
    )

    if response.status_code == 200:
        print("Message successfully sent!")
    else:
        print(f"Failed to send message: {response.status_code} - {response.text}")