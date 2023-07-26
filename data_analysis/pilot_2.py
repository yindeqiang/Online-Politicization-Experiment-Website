import json
import pandas as pd
from sqlalchemy import create_engine, Column, String, Integer, Float, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from server import Base, Pilot_1, Pilot_2
import numpy as np
import math

questions = [
    {
        'statement': "If a robot's body, language, behavior, and emotions are no diﬀerent from human beings, then this robot should enjoy the same basic human rights as ordinary people.",
        'type': 'issue'
    },
    {
        'statement': "After artiﬁcial intelligence technology matures, human judges should be replaced by AI. This can better ensure the fairness of court decisions.",
        'type': 'issue'
    },
    {
        'statement': "If it is technically feasible to transfer part of one person's lifetime to another person, the government should allow the legalization of such life trading.",
        'type': 'issue'
    },
    {
        "statement": "The government should invest more scientiﬁc research funding into space exploration instead of virtual reality technology.",
        'type': 'issue'
    },
    {
        'statement': "If scientists discover that a huge asteroid is about to hit and destroy the earth in one year, the government should keep it secret from the public to avoid social panic.",
        'type': 'issue'
    },
    {
        'statement': "If technically feasible, adults without fertility should be allowed to adopt their own clones.",
        'type': 'issue'
    },
    {
        'statement': "Self-driving cars should be programmed to make life-or-death decisions that minimize total harm or death, even if that means sacriﬁcing the driver's own safety.",
        'type': 'issue'
    },
    {
        'statement': "The use of cloning technology should be approved, to provide infertile couples using test-tube fertilization with more embryos to increase their chances of conceiving.",
        'type': "issue"
    },
    {
        'statement': "Everyone should be allowed to use paid advertising to present their point of view on controversial public policy issues, no matter how insane it is.",
        'type': "issue"
    },
    {
        'statement': "If newer technologies become available in the future related to vision or sight, it is appropriate to use technologies to improve a person's normal vision to a level that is greatly beyond normal human capabilities.",
        'type': "issue"
    },
    {
        'statement': "How many homicides were oﬃcially registered in Chicago in 2021?",
        'type': 'fact',
        'range': [100, 1000],
        'step': 10,
        'percentage': False
    },
    {
        'statement': "What was the percentage of the population growth in California from 2010 to 2020?",
        'type': 'fact',
        'range': [0.01, 0.1],
        'step': 0.001,
        'percentage': True
    },
    {
        'statement': "How far on average is Mars from Earth? (in million miles)",
        'type': 'fact',
        'range': [100, 190],
        'step': 1,
        'percentage': False
    },
    {
        'statement': "How many cells on average does an adult body produce every second? (in million)",
        'type': 'fact',
        'range': [18, 30],
        'step': 0.1,
        'percentage': False
    },
    {
        'statement': "How many elevators are there in New York's Empire State Building?",
        'type': 'fact',
        'range': [68, 80],
        'step': 1,
        'percentage': False
    },

    {
        'statement': "In 50 years, cryptocurrencies (such as Bitcoin, Ethereum, or Litecoin) will replace the US dollars and become the oﬃcial currency of the US.",
        'type': 'prediction',
    },
    {
        'statement': "Within 50 years, self-driving technology will be suﬃciently mature that most personal cars will no longer be equipped with a steering wheel.",
        'type': 'prediction'
    },
    {
        'statement': "As artificial-intelligence technology develops, most people will eventually live better lives without having to work.",
        'type': 'prediction'
    },
    {
        'statement': "If scientists invented a non-invasive clinical surgery that could accurately erase people's memory of a certain period, the overall happiness of our society would be greatly improved.",
        'type': 'prediction'
    },
    {
        'statement': "Within the next 100 years, human beings will have contact with intelligent life from other planets.",
        'type': 'prediction'
    },
    {
        'statement': "Within the next 100 years, computer scientists will develop computers with true artificial intelligence. That is, computers that can think for themselves.",
        'type': 'prediction'
    },
    {
        'statement': "In the future, robots and computers with advanced capabilities may be able to do most of the jobs that are currently done by humans today. Within 50 years, the job of software engineers will likely be mostly replaced by robots or computers.",
        'type': "prediction"
    },
    {
        'statement': "If robots and computers were able to perform most of the jobs currently being done by humans, the economy as a whole would be more efficient.",
        'type': "prediction"
    },
    {
        'statement': "Very likely, a breakthrough will occur within the next 5 years in the area of cheaper energy.",
        'type': "prediction"
    },
    {
        'statement': "In the next 50 years, computers will be as effective as people at creating important works of art such as music, novels, movies, or paintings.",
        'type': "prediction"
    }
]

print(type(questions[0]['type']))


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

data = session.query(Pilot_2).all()
question_num = len(data[0].pilot_2_answers)
Ideology = []
answers = []
for _ in range(question_num):
    answers.append([])

for result in data:
    if not result.attention_passed or result.total_time < 90:
        continue
    for index, answer in enumerate(result.pilot_2_answers):
        answers[index].append(answer)
    Ideology.append(result.ideology_label)

Answers = np.array(answers)
Average = np.average(Answers, axis=1).tolist()
Std = np.std(Answers, axis=1).tolist()

results = []
for i in range(question_num):
    average = Average[i]

    if questions[i]['type'] == 'fact':
        if average < questions[i]['range'][0] or average > questions[i]['range'][1]:
            print(f"Out of range for question {i}")
    else:
        if average < -3 or average > 3:
            print(f"Out of range for questions {i}")

    offset = 0
    positive = 0
    if questions[i]['type']== 'fact':
        middle = (questions[i]['range'][0] + questions[i]['range'][1]) / 2
        offset = (average - middle) / (questions[i]['range'][1] - questions[i]['range'][0])
        positive = np.sum(Answers[i] > middle) / len(Answers[i])
    else:
        offset = average / 6
        positive = np.sum(Answers[i] > 0) / len(Answers[i])

    results.append(
        {
            'text': questions[i]['statement'],
            'type': questions[i]['type'],
            'correlation': np.corrcoef(np.array(Ideology), np.array(Answers[i]))[0, 1],
            'positive': positive,
            'average offset': offset,
        }
    )

    results = sorted(results, key=lambda x: abs(x['correlation']))

with open('pilot_2_result.json', 'w') as f:
    json.dump(results, f)

