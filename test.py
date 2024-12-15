import asyncio
from bleak import BleakScanner
import requests



async def scan_all_signals():
    print("Scanning for all BLE signals... Press Ctrl+C to stop.")

    def detection_callback(device, advertisement_data):
        if device.address == 'C3:00:00:2E:6C:06':
            print(str(advertisement_data.service_data))
            if str('help') in str(advertisement_data.service_data):
                print('-'*50)
                print('Help')
                data = {"message": "help"}
                response = requests.post("http://172.16.2.63:4242/signal", json=data)
                print('-'*50)
            elif str('imok') in str(advertisement_data.service_data):
                print('-'*50)
                print('Im Ok')
                data = {"message": "ok"}
                response = requests.post("http://172.16.2.63:4242/signal", json=data)
                print('-'*50)



    # Start scanning and set the callback
    scanner = BleakScanner(detection_callback)
    await scanner.start()

    try:
        # Keep scanning indefinitely
        while True:
            await asyncio.sleep(1)
    except KeyboardInterrupt:
        print("Stopping scan.")
    finally:
        await scanner.stop()
        print("Scan stopped.")

asyncio.run(scan_all_signals())
