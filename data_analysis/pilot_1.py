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

data = session.query(Pilot_1).all()
inspector = inspect(Pilot_1)
print(inspector.get_column_names())