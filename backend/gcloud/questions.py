import random
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
