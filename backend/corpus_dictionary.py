from Day import *
from Block import *

class Corpus:
    def __init__(self):
        self.words = {} # key: keyword, value: list of dates
        self.tfidf_weights = {} # key: words, value: weights

    def add_words(self, Day):
        for keyword in Day.keywords:
            if keyword not in self.words: # if keyword is not in corpus yet, add it
                self.words[keyword] = [Day.date]
            else: # keyword is in corpus, just need to add date
                self.words[keyword].append(Day.date)
