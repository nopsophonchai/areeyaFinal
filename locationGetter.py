import cv2
import json
from shapely.geometry import Point, Polygon

# Load the image
image_path = '/Users/noppynorthside/projectdev/1731128143610.jpg'
img = cv2.imread(image_path)

# Load locations from JSON file
with open("points.json", "r") as f:
    locations = json.load(f)
print(locations)

mode = 'create'
points = []

# Mouse callback function to record clicks
def click_event(event, x, y, flags, params):
    global originalX, originalY
    if event == cv2.EVENT_LBUTTONDOWN:
        if mode == 'save':
            if len(points) == 0:
                originalX, originalY = x, y
                points.append({"x": originalX, "y": originalY})  # Set the first point as the origin
                print(f"Point recorded at: ({0}, {0})")
                cv2.circle(img, (x, y), 5, (0, 0, 255), -1)
            else:
                rel_x, rel_y = x - originalX, y - originalY
                points.append({"x": rel_x, "y": rel_y})
                print(f"Point recorded at: ({rel_x}, {rel_y})")
                cv2.circle(img, (x, y), 5, (255, 0, 0), -1)
        
        elif mode == 'test':
            # Get the original point (reference point for relative coordinates)
            originalPoint = locations['points'][0]
            
            # Draw a circle at the clicked location
            cv2.circle(img, (x, y), 5, (255, 0, 0), -1)
            
            # Extract relative coordinates for the polygon (skip the original point)
            coordinates = [(p['x'], p['y']) for p in locations['points'][1:]]
            
            # Create the polygon with these relative coordinates
            polygon = Polygon(coordinates)
            
            # Define the test point relative to the original point
            test_point = Point(x - originalPoint['x'], y - originalPoint['y'])
            
            # Print the relative coordinates of the test point
            print(f"Relative Point recorded at: ({test_point.x}, {test_point.y})")
            
            # Check if the test point is within the polygon
            is_inside = polygon.contains(test_point)
            print("Is the point inside the polygon?", is_inside)
        elif mode == 'create':
            originalPoint = locations['points'][0]
            rel_x, rel_y = x - originalPoint['x'], y - originalPoint['y']
            points.append({"x": rel_x, "y": rel_y})
            print(f"Point recorded at: ({rel_x}, {rel_y})")
            cv2.circle(img, (x, y), 5, (255, 0, 0), -1)
        cv2.imshow("Image", img)

# Display the image and set up the click event
cv2.imshow("Image", img)
cv2.setMouseCallback("Image", click_event)

# Wait until the user closes the window
cv2.waitKey(0)
cv2.destroyAllWindows()

# Save the points to a JSON file
if mode == 'save' or mode =='create':
    with open("scenarioThree.json", "w") as f:
        json.dump({"points": points}, f, indent=4)
    print("Points saved to points.json")
