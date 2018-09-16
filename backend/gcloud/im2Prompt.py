from captionbot import CaptionBot
import nltk
import random
import importlib
import sys
import urllib

import gCloudStorage
import im2metadata
import gVision
import questions

class QuestionGeneration(object):
    def __init__(self):
        pass

    def askGeneralQ(self):
        return random.choice(["What is something that bugged you today?",
        "What is something you should work on?",
        "What was your favorite thing about today?",
        "Who did you talk to today and about what?",
        "What were you grateful for today?",
        "Did you notice anything different today?",
        "What did you accomplish today?"])

    def askLocationQ(self, location):
        return random.choice(["What did you do in %s?" %location,
        "Why did you go to %s?" %location,
        "What did eat do in %s?" %location,
        "Who did you meet in %s?" %location,
        "First time in %s?" %location,
        "Have you ever been to %s?" %location])

    def askActivityQ(self, activity):
        return random.choice(["How did %s go?" %activity,
        "Can you tell me more about %s?" %activity,
        "Was %s fun?" %activity])

    def askFoodQ(self, food):
        return random.choice(["How was your meal?",
        "Have a good meal?"])

    def askPeopleQ(self):
        return random.choice(["With friends?",
        "Who were you with?"])

# order of things to be printed
# timestamp - 11:30pm as string
# caption
# image_url
# image_prompt

# {'type': 'timestamp', 'data': timestamp},
# {'type': 'caption', 'data': caption},
# {'type': 'image', 'data': image},
# {'type': 'emoji', 'data': emoji},
# {'type': 'imagePrompt', 'data': imagePrompt},
def main():
    # load data from front end
    photo_url = sys.argv[1]
    keyword_dict_str = sys.argv[2]

    photo_name = str(random.randint(0, 99999999)) + ".jpg"
    loc_photo_path = "./fromFrontEnd/" + photo_name
    urllib.urlretrieve(photo_url, loc_photo_path )

    gcloud_base_url = 'https://storage.googleapis.com/project-tao/'
    photo_gcloud_url = gcloud_base_url + photo_name

    # upload to gCloudStorage
    bucket_name = 'project-tao'
    gCloudStorage.upload_blob(bucket_name, loc_photo_path, photo_name)

    # localPhotoPath = '../resources/kastanByLake.jpg'
    date_str, time_nl, time_12hr_str, address_nl = im2metadata.im2date_time_addr(loc_photo_path)
    print("TEST 12 hour string: " + time_12hr_str) # TODO DELETE

    capt = captionImage(photo_gcloud_url)

    print("{'type': 'timestamp', 'data':" + time_12hr_str + "}, ")
    print("{'type': 'caption', 'data':" + capt + "}, ")
    print("{'type': 'image', 'data':" + photo_gcloud_url + "}, ")

    labels_list = gVision.gcloudLabels(loc_photo_path)
    group_bool = gVision.gcloudFaces(loc_photo_path)

    d = {}
    tokenizeAndPopulateDict(capt, d, address_nl, date_str, group_bool)
    for word in labels[:5]:
        tokenizeAndPopulateDict(word, d)


def captionImage(url):
    image_url = url
    cBot = CaptionBot()
    # caption = cBot.url_caption(image_url)
    caption = cBot.file_caption(filePath)
    caption = caption.split(" ")[2:]
    caption = " ".join(caption)
    return caption

# types of blocks:
# timestamp, caption, image, imagePrompt (fitbit, location)
def tokenizeAndPopulateDict(sentence, dict, location, date, type):
    tokens = nltk.word_tokenize(sentence)
    tagged = nltk.pos_tag(tokens)
    print("tagged", tagged)
    for word in tagged:
        keyword = word[0]
        pos = word[1]
        locationAndDate=None
        if location != None and date != None:
            locationAndDate = [location, date]
        dict[keyword] = {"location": location,
                        "pos": pos,
                        "date": date,
                        "type": type,
                        "locationAndDate": locationAndDate}

    group = None
    activity = None
    food = None
    if type == "Group":
        group = True
    elif type == "Activity":
        activity = True
    elif type == "Food":
        food = True
    askQs(location, activity, food, group)
    sys.stdout.flush()

def askQs(location=None, activity=None, food=None, group=None):
    qG = questions.QuestionGeneration()
    if location == True or activity == True or food == True or group == True:
        if location:
            print({'type': 'imagePrompt', 'data': qG.askLocationQ(location)})
        if group:
            print({'type': 'imagePrompt', 'data': qG.askPeopleQ()})
        if activity:
            print({'type': 'imagePrompt', 'data': qG.askActivityQ(activity)})
        if food:
            print({'type': 'imagePrompt', 'data': qG.askFoodQ(food)})
    else:
        print({'type': 'imagePrompt', 'data': qG.askGeneralQ()})

main()
