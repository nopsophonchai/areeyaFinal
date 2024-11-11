from shapely.geometry import Point, Polygon
import json

path = '/Users/noppynorthside/projectdev/dummyCoordinates.json'

with open(path,'r') as file:
    jsonCoordinates = json.load(file)


coordinates = jsonCoordinates['features'][0]['geometry']['coordinates']
geofencePolygon = Polygon(coordinates)
print(geofencePolygon)
# # Define your geofence coordinates as a list of tuples
# geofence_coords = [(0, 0), (2, 2), (2, 0), (0, 2)]
print(geofencePolygon.contains(Point(100.5851773250655,13.79831610182606)))


testCoordinates = jsonCoordinates['features'][1]['geometry']['coordinates']
print(testCoordinates)
for i in testCoordinates:
    print(geofencePolygon.contains(Point(i)))

# # Create a Polygon from the coordinates
# geofence_polygon = Polygon(geofence_coords)

# # Function to check if a point is within the geofence
# def is_within_geofence(lat, lon):
#     point = Point(lat, lon)
#     return geofence_polygon.contains(point)

# # Test with a point
# test_point = (1, 1)
# print(is_within_geofence(*test_point))  # Output: True or False
