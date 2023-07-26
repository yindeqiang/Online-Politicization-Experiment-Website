import json
import pandas as pd
from sqlalchemy import create_engine, Column, String, Integer, Float, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import numpy as np

import os
import sys
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(os.path.dirname(current_dir))
from server import Base, Pilot_2

SQLALCHEMY_DATABASE_URI = "mysql+mysqlconnector://{username}:{password}@{hostname}/{databasename}".format(
    username="Grawi",
    password="david2202087",
    hostname="Grawi.mysql.pythonanywhere-services.com",
    databasename="Grawi$Interactive_quiz_database",
)

engine = create_engine(SQLALCHEMY_DATABASE_URI)
Session = sessionmaker(bind=engine)
session = Session()

columns_to_read= ['ParticipantId', 'Status', 'Political Ideology']
df = pd.read_csv('data_pilot_2.csv', usecols=columns_to_read)
valid_df = df[df['Status'] == 'Pending']

translator = {
    'Liberal': 0,
    'Somewhat Liberal': 1,
    'Moderate': 1.5,
    'Somewhat Conservative': 2,
    'Conservative': 3
}

valid_df['Political Ideology'] = valid_df['Political Ideology'].map(translator).to_list()

len = 0
correct = 0
reverse = 0

for _, row in valid_df.iterrows():
    participantId = row['ParticipantId']
    platform_ideology = row['Political Ideology']
    result = Pilot_2.query.filter_by(participantId=participantId).all()
    if result:
        len += 1
        experiment_ideology = result[0].ideology_label
        if abs(platform_ideology - experiment_ideology) <= 0.5:
            correct += 1
        if platform_ideology > 1.5 and experiment_ideology < 1.5 or platform_ideology < 1.5 and experiment_ideology > 1.5:
            reverse += 1


print(f"Precision: {correct / len}, Reversed: {reverse / len}")