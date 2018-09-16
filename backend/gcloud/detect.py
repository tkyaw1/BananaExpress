import io
import os

# Imports the Google Cloud client library
from google.cloud import vision
from google.cloud.vision import types

# Instantiates a client
client = vision.ImageAnnotatorClient()

# .from_service_account_json(
        # 'ProjectTao-782142094f75.json')

# The name of the image file to annotate
file_name = os.path.join(
    os.path.dirname(__file__),
    '../resources/groupPhoto.jpg')

# Loads the image into memory
with io.open(file_name, 'rb') as image_file:
    content = image_file.read()

image = vision.types.Image(content=content)

def gcloudLabels(image):
    # Performs label detection on the image file
    response = client.label_detection(image=image)
    labels = response.label_annotations

    print('Labels:')
    for label in labels:
        print(label.description)
    

def gcloudFaces(image):
    # Perform face detecion
    response = client.face_detection(image=image)
    faces = response.face_annotations

    # Names of likelihood from google.cloud.vision.enums
    # likelihood_name[0] == 'UNKNOWN'
    likelihood_name = ('UNKNOWN', 'VERY_UNLIKELY', 'UNLIKELY', 'POSSIBLE', 'LIKELY', 'VERY_LIKELY')

    group = False
    if len(faces) > 1:
        group = True

    # print('Face(s):')
    # for face in faces:
    #     print('anger: {}'.format(likelihood_name[face.anger_likelihood]))
    #     print('joy: {}'.format(likelihood_name[face.joy_likelihood]))
    #     print('surprise: {}'.format(likelihood_name[face.surprise_likelihood]))
    #     print(face.anger_likelihood)

# def gcloudLandmarks():
    #todo

gcloudLabels(image)
gcloudFaces(image)