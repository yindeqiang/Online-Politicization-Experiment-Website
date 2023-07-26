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
from server import Base, Pilot_1, Pilot_2

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

platform_ideology = df['Political Ideology'].map(translator).to_numpy()
experiment_ideology = session.query(Pilot_2.ideology_label).all()
experiment_ideology = np.array([ideology[0] for ideology in experiment_ideology])
print(experiment_ideology)
# print(platform_ideology[:10], experiment_ideology[:10], sep='\n\n')

difference = np.abs(experiment_ideology - platform_ideology)

precision = np.sum(difference <= 0.5) / len(difference)
print(f"Precision: {precision}")