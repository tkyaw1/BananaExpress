from captionbot import CaptionBot
import nltk
import random
import importlib

im2metadata = input('./gcloud/im2metadata.py')
gVision = input('./gcloud/gVision.py')
importlib.import_module(im2metadata )
importlib.import_module(gVision )

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
        "What did you accomplish today?",
        "What is something you want to do tomorrow?",
        "What is something you want to do this weekend?",
        "What is something you want to do soon?"])

    def askLocationQ(self, location):
        return random.choice(["What did you do in %s?" %location,
        "Why did you go to %s?" %location,
        "What did eat in %s?" %location,
        "Who did you meet in %s?" %location,
        "First time in %s?" %location,
        "Have you ever been to %s?" %location])

    def askActivityQ(self, activity):
        return random.choice(["How did %s go?" %activity,
        "Can you tell me more about %s?" %activity,
        "Was %s fun?" %activity])

    def askFoodQ(self, food):
        return random.choice(["How was your meal?",
        "Have a good meal?", "Would you get the same meal again?"])

    def askPeopleQ(self):
        return random.choice(["With friends?",
        "Who were you with?"])

    def askCompActivityQ(self, verb_ing, date, location):
        """ Given that the verb was an ing verb:
        """
        return random.choice(["How was %s this time compared to %s on %s at %s?" % (verb_ing, verb_ing, date, location)]) #TODO: need to add more to this


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
