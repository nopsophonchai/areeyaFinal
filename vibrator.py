from bleak import BleakClient
import asyncio

TARGET_MAC = "C3:00:00:2E:6C:06"  # Replace with your BLE device MAC address

async def discover_services():
    async with BleakClient(TARGET_MAC) as client:
        print(f"Connected to device: {TARGET_MAC}")
        services = await client.get_services()
        print("Discovered Services and Characteristics:")
        for service in services:
            print(f"Service: {service.uuid}")
            for characteristic in service.characteristics:
                print(f"  Characteristic: {characteristic.uuid}")
                print(f"    Properties: {characteristic.properties}")

asyncio.run(discover_services())
