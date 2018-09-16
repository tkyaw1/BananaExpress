from captionbot import CaptionBot
import nltk
import random
import importlib

im2metadata = input('./gcloud/im2metadata.py')
gVision = input('./gcloud/gVision.py')
importlib.import_module(im2metadata )
importlib.import_module(gVision)

def main():
    capt = captionImage("https://www.rawstory.com/wp-content/uploads/2015/05/A-man-surfing-Shutterstock.jpg")
    print("captioinnnn:", capt)

    localPhotoPath = './resources/groupPhoto.jpg'
    date_str, time_nl, address_nl = im2metadata.im2date_time_addr(localPhotoPath)
    # todo: google clout storage (get url)
    # todo: captionize
    labels_list = gVision.gcloudLabels(localPhotoPath)
    group = gVision.gcloudFaces(localPhotoPath)


    d = {}
    tokenizeAndPopulateDict(capt, d, "Seattle", "Thursday", "group")
    # for word in labels[:5]:
    #     tokenizeAndPopulateDict(word, d)


def captionImage(url):
    image_url = url
    cBot = CaptionBot()
    caption = cBot.url_caption(image_url)
    caption = caption.split(" ")[2:]
    caption = " ".join(caption)
    return caption


def tokenizeAndPopulateDict(sentence, dict, location, date, type):
    tokens = nltk.word_tokenize(sentence)
    tagged = nltk.pos_tag(tokens)
    print("tagged", tagged)
    for word in tagged:
        keyword = word[0]
        pos = word[1]
        dict[keyword] = {"location": location,
                        "pos": pos,
                        "date": date,
                        "type": type}

    group = None
    activity = None
    food = None
    if type == "Group":
        group = True
    elif type == "Activity":
        activity = True
    elif type == "Food":
        food = True
    print(askQs(location, activity, food, group))

def askQs(location=None, activity=None, food=None, group=None):
    qG = QuestionGeneration()
    if location:
        return qG.askLocationQ("Seattle")
    elif group:
        return qG.askPeopleQ()
    elif activity:
        return qG.askActivityQ("activity")
    elif food:
        return qG.askFoodQ("food")
    else:
        return qG.askGeneralQ()

main()
