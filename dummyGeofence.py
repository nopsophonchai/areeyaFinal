from shapely.geometry import Point, Polygon
import json

path = 'points.json'



def geofence(x,y):
    with open(path,'r') as file:
        locations = json.load(file)
    locations = locations['points']
    coordinates = Polygon(([(locations[i]['x'],locations[i]['y']) for i in range(len(locations))]))
    checkedPoint = Point(x,y)
    isInside = coordinates.contains(checkedPoint)
    print(coordinates)
    print(isInside)
    return (isInside,coordinates)

