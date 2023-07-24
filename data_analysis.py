import json
import pandas as pd
from sqlalchemy import create_engine, Column, String, Integer, Float, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from server import Base, Pilot_1, Pilot_2

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

results = session.query(Pilot_2).all()
print(type(results))