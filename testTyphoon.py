from constants import *
import requests

typhoonUrl = 'https://api.opentyphoon.ai/v1/chat/completions'
typhoonAPI = TYPHOONAPI

typhoonHeader = {
    'Content-Type': 'application/json',
    'Authorization': f'Bearer {typhoonAPI}'
}
typhoonData = {
    "model": "typhoon-v1.5x-70b-instruct",
        "messages": [
        {
            "role": "system",
            "content": "You are a helpful assistant. Prompt in english reply in english prompt in thai reply in thai. Answer in short sentences"
        },
        {
            "role": "user",
            "content": "hello!"
        }
        ],
        "max_tokens": 512,
        "temperature": 0.6,
        "top_p": 0.95,
        "repetition_penalty": 1.05,
        "stream": False
}

testPrompt = requests.post(typhoonUrl,headers=typhoonHeader,json=typhoonData)
testResponse = testPrompt.json()
print(testResponse)
print('\n')


print(testResponse['choices'][0]['message']['content'])

def talk(message):
    typhoonData['messages'].append({"role": "user", "content": message})
    response = requests.post(typhoonUrl,headers=typhoonHeader,json=typhoonData).json()
    print(response)
    print(response['choices'][0]['message']['content'])
    return response['choices'][0]['message']['content']

# while True:
#     message = input('Hi! Type anything here to talk!\t')
#     talk(message)