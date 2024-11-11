import requests
import json
import time

# Load GPS data from a JSON file
with open("scenarioOne.json", "r") as f:
    scenarioOne = json.load(f)
with open("scenarioTwo.json", "r") as f:
    scenarioTwo = json.load(f)

webhook_url = "https://c0c0-2405-9800-ba10-7c9e-25f3-df44-b618-3119.ngrok-free.app/webhook"  # URL of your webhook

# Loop through GPS data and send each point every 5 seconds
while True:
    scenario = int(input('Select Scenario:\t'))
    if scenario == 1:
        for point_data in scenarioOne["points"]:
            latitude = point_data["x"]  # Assuming 'x' represents latitude
            longitude = point_data["y"]  # Assuming 'y' represents longitude
            
            # Create the payload to send to the webhook
            payload = {
                "events": [
                    {
                        "type": "message",
                        "source": {"userId": "dummy_user"},
                        "message": {
                            "type": "location",
                            "latitude": latitude,
                            "longitude": longitude
                        }
                    }
                ]
            }
            response = requests.post(webhook_url, json=payload)
            print(f"Sent GPS coordinates ({latitude}, {longitude}), Response: {response.status_code}")
            time.sleep(5)
    else:
        for point_data in scenarioTwo["points"]:
            latitude = point_data["x"]  # Assuming 'x' represents latitude
            longitude = point_data["y"]  # Assuming 'y' represents longitude
            
            # Create the payload to send to the webhook
            payload = {
                "events": [
                    {
                        "type": "message",
                        "source": {"userId": "dummy_user"},
                        "message": {
                            "type": "location",
                            "latitude": latitude,
                            "longitude": longitude
                        }
                    }
                ]
            }
            response = requests.post(webhook_url, json=payload)
            print(f"Sent GPS coordinates ({latitude}, {longitude}), Response: {response.status_code}")
            time.sleep(5)
