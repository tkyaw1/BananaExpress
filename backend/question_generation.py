import sys
import ast
from random import randint
from questions import QuestionGeneration

"""
    argv[1] : keyword dictionary
    argv[2] : corpus
    argv[3] : user text
"""

# def extract_keywords(new_text):
#     """ takes new user text and returns a list of keywords
#     """
#     headers = {'Ocp-Apim-Subscription-Key': '59bf3be460ad434585a4b4143c470a92'}
#     document = {'documents': [{'id': '1', 'text': new_text}]}
#     azure_url = "https://eastus.api.cognitive.microsoft.com/text/analytics/v2.0/KeyPhrases"
#
#     response = requests.post(azure_url, headers=headers, json=document)
#     response = response.json()
#     return [keyword.encode('utf-8') for keyword in response['documents'][0]['keyPhrases']]
#
# def extract_date_location(keyword_entry, date_location):
#     """ Given a keywords entry in the keyword_dict, return either the most recent date or location
#     """
#     data_len = len(keyword_entry[date_location])
#     # if only one date, return that date
#     if data_len == 1:
#         return keyword_entry[date_location][0]
#     else:
#         # 70% of the time, grab the most recent date
#         if randint(0,9) < 7:
#             return keyword_entry[date_location][-1]
#         else: # grab a random date in the list
#             return keyword_entry[date_location][randint(0,data_len)]


def main():
    # take command line arguments and decode them from "{}" to {}
    keyword_dict = ast.literal_eval(sys.argv[1])
    corpus = ast.literal_eval(sys.argv[2])
    new_text = sys.argv[3]

    # # instantiate question generator:
    # qqgen = QuestionGeneration()
    # questions = []
    # # extract keywords
    # keywords = extract_keywords(new_text)
    # for keyword in keywords:
    #     if keyword in keyword_dict: # the keyword exists in the dictionary already
    #         date = extract_date_location(keyword_dict[keyword], 'date')
    #
    #         location = extract_date_location(keyword_dict[keyword], 'location')
    #         questions.append(qqgen.askLocationQ(location))
    #
    #         if len(keyword_dict['activity']) != 0:
    #             questions.append(qqgen.askActivityQ(keyword_dict['activity']))
    #

    # print questions
    print keyword_dict
    sys.stdout.flush()

if __name__ == '__main__':
    main()
