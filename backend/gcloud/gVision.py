import io
import os
from google.cloud import vision
from google.cloud.vision import types

def gcloudLabels(imagePath):
    # Instantiates a client
    client = vision.ImageAnnotatorClient()

    file_name = os.path.join(
        os.path.dirname(__file__), imagePath)

    # Loads the image into memory
    with io.open(file_name, 'rb') as image_file:
        content = image_file.read()

    image = vision.types.Image(content=content)

    # Performs label detection on the image file
    response = client.label_detection(image=image)
    rawLabels = response.label_annotations

    labels = []
    # print('Labels:')
    for label in rawLabels:
        # print(label.description):w

        labels.append(label.description)

    # if labels.contains("food", "resturant", "meal", "breakfast")

    return labels


def gcloudFaces(imagePath):
        # Instantiates a client
    client = vision.ImageAnnotatorClient()

    file_name = os.path.join(
        os.path.dirname(__file__), imagePath)

    # Loads the image into memory
    with io.open(file_name, 'rb') as image_file:
        content = image_file.read()

    image = vision.types.Image(content=content)

    # Perform face detecion
    response = client.face_detection(image=image)
    faces = response.face_annotations

    # Names of likelihood from google.cloud.vision.enums
    # likelihood_name[0] == 'UNKNOWN'
    likelihood_name = ('UNKNOWN', 'VERY_UNLIKELY', 'UNLIKELY', 'POSSIBLE', 'LIKELY', 'VERY_LIKELY')

    group = False
    if len(faces) > 1:
        group = True

    return group

    # print('Face(s):')
    # for face in faces:
    #     print('anger: {}'.format(likelihood_name[face.anger_likelihood]))
    #     print('joy: {}'.format(likelihood_name[face.joy_likelihood]))
    #     print('surprise: {}'.format(likelihood_name[face.surprise_likelihood]))
    #     print(face.anger_likelihood)

def gcloudLandmarks(path):
    """Detects landmarks in the file."""
    client = vision.ImageAnnotatorClient()

    with io.open(path, 'rb') as image_file:
        content = image_file.read()

    image = vision.types.Image(content=content)

    response = client.landmark_detection(image=image)
    landmarks = response.landmark_annotations
    print('Landmarks:')
    if len(landmarks) >= 1:
        print( landmarks[0].description)
        return landmarks[0].description
    else:
        return False

    # for landmark in landmarks:
    #     print(landmark.description)
    #     for location in landmark.locations:
    #         lat_lng = location.lat_lng
    #         print('Latitude {}'.format(lat_lng.latitude))
    #         print('Longitude {}'.format(lat_lng.longitude))

# def gcloudLandmarks():
    #todo
def main():
    pass
    # gcloudLandmarks('../resources/sadEiffel.jpg')
    # gcloudLabels(image)
    # gcloudFaces(image)

if __name__ == "__main__":
    main()
