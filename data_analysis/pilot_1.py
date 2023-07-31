import json
import pandas as pd
from sqlalchemy import create_engine, Column, String, Integer, Float, JSON, inspect
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import numpy as np
import math
import os
import sys
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.dirname(current_dir))
from server import Base, Pilot_1
import matplotlib.pyplot as plt

translator = {
    'Liberal': -2,
    'Somewhat Liberal': -1,
    'Moderate': 0,
    'Somewhat Conservative': 1,
    'Conservative': 2
}

# database
SQLALCHEMY_DATABASE_URI = "mysql+mysqlconnector://{username}:{password}@{hostname}/{databasename}".format(
    username="Grawi",
    password="david2202087",
    hostname="Grawi.mysql.pythonanywhere-services.com",
    databasename="Grawi$Interactive_quiz_database",
)

engine = create_engine(SQLALCHEMY_DATABASE_URI)
Session = sessionmaker(bind=engine)
session = Session()


valid_data = session.query(Pilot_1).all()
additional_answers = [data.additional_answers[0][0] for data in valid_data]
df = pd.read_csv('data_pilot_1.csv', usecols=['ParticipantId', 'Political Ideology'])
df['Political Ideology'] = df['Political Ideology'].map(translator)

length = 0
match = 0
reverse = 0

for _, row in df.iterrows():
    participantId = row['ParticipantId']
    platform_ideology = row['Political Ideology']
    result = Pilot_1.query.filter_by(participantId=participantId).all()
    if result:
        length += 1
        experiment_ideology = result[0].additional_answers[0][0]
        if platform_ideology * experiment_ideology >= 0 and abs(platform_ideology - experiment_ideology) <= 1:
            match += 1
        if platform_ideology * experiment_ideology < 0:
            reverse += 1

print(f"Match ratio: {match / length}, reverse ratio: {reverse / length}")

distance_sums = []
ideology_distances = []
kindness = []
competence = []
num_correct_classifications = 0

experiments_answers = [data.ideology_answers for data in valid_data]
additional_answers = [data.additional_answers for data in valid_data]
ideologies = [data.ideologies for data in valid_data]

for idx, experiment_answers in enumerate(experiments_answers):
    questions_answers = [answer_data['answers'] for answer_data in experiment_answers]
    distance_sum = [0, 0]

    # iterate all questions for one participant
    for question_answers in questions_answers:
        for i in range(2):
            distance_sum[i] += abs(question_answers[0] - question_answers[i + 1])
    distance_sums.append(distance_sum[0])
    distance_sums.append(distance_sum[1])


    for i in range(2):
        ideology_distances.append(abs(additional_answers[idx][0][i + 1] - additional_answers[idx][0][0]))

        kindness.append(additional_answers[idx][1][i])
        competence.append(additional_answers[idx][2][i])
        if ideologies[idx][i + 1] * additional_answers[idx][0][i + 1] > 0:
            num_correct_classifications += 1

print("ideology distance and answer differences", np.corrcoef(distance_sums, ideology_distances)[0, 1])
print("kindness", np.corrcoef(ideology_distances, kindness)[0, 1], np.corrcoef(distance_sums, kindness)[0, 1])
print("competence", np.corrcoef(ideology_distances, competence)[0, 1], np.corrcoef(distance_sums, competence)[0, 1])
print(f"Correct Classfication Ratio: {num_correct_classifications / (2 * len(ideologies))}")


# plt.scatter(distance_sums, ideology_distances)
# plt.xlabel('Number of Different Answers')
# plt.ylabel('Distance of Perceived Ideology')
# plt.savefig('Ideology Distance.jpg')
# plt.close()
# plt.scatter(ideology_distances, kindness)
# plt.xlabel('Ideology Distance')
# plt.ylabel('Warmth')
# plt.title('Scatter Plot of Warmth')
# plt.savefig('warmth.jpg')
# plt.close()
# plt.scatter(ideology_distances, competence)
# plt.xlabel('Ideology Distance')
# plt.ylabel('Competence')
# plt.title('Scatter Plot of Competence')
# plt.savefig('conpetence.jpg')

human_time_to_answer = 0
bot_time_to_answer = 0


for experiment_answers in experiments_answers:
    for idx, answer_data in enumerate(experiment_answers):
        if idx != 0:
            human_time_to_answer += answer_data['time_to_answer'][0]
            bot_time_to_answer+= (answer_data['time_to_answer'][1] + answer_data['time_to_answer'][2])

human_time_to_answer /= (9 * len(experiments_answers))
bot_time_to_answer /= (2 * 9 * len(experiments_answers))

print("Time for human and bot", human_time_to_answer, bot_time_to_answer)

nums_of_agrees = []
num_of_participants = [0, 0, 0, 0]
for _ in range(10):
    nums_of_agrees.append([0, 0, 0, 0])

for idx, experiment_answers in enumerate(experiments_answers):
    target = 0
    if additional_answers[idx][0][0] >= -2 and additional_answers[idx][0][0] < 0:
        target = 0
    elif additional_answers[idx][0][0] > 0 and additional_answers[idx][0][0] >= -2:
        target = 1
    elif additional_answers[idx][0][0] < -2 and additional_answers[idx][0][0] >= -3:
        target = 2
    elif additional_answers[idx][0][0] > 2 and additional_answers[idx][0][0] <= 3:
        target = 3

    num_of_participants[target] += 1

    for answer_data in experiment_answers:
        if answer_data['answers'][0] == 0:
            nums_of_agrees[answer_data['idx_of_question']][target] += 1

print("num_of_participants", num_of_participants)
for num_of_agrees in nums_of_agrees:
    for i in range(3):

        num_of_agrees[i] /= num_of_participants[i]

for num_of_agrees in nums_of_agrees:
    print(num_of_agrees)

