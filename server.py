from crypt import methods
from email import header
import time
from flask import Flask, render_template, request, url_for, send_from_directory
import json, os
from itsdangerous import exc
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, String, JSON, Float

MAX_NAME_LEN = 20

# database
app = Flask(__name__)
app.config["DEBUG"] = True
SQLALCHEMY_DATABASE_URI = "mysql+mysqlconnector://{username}:{password}@{hostname}/{databasename}".format(
    username="Grawi",
    password="david2202087",
    hostname="Grawi.mysql.pythonanywhere-services.com",
    databasename="Grawi$Interactive_quiz_database",
)
app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI
app.config["SQLALCHEMY_POOL_RECYCLE"] = 299     # don't have to know about this
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db = SQLAlchemy(app)

class Pilot_1(db.Model):
    __tablename__ = "pilot_1"
    aid = Column(Integer, primary_key=True)
    name = Column(String(MAX_NAME_LEN))
    avatar = Column(Integer)
    # attention_passed = Column(Integer)
    # phase_1_answers = Column()
    # additional_question_answers = Column(JSON)

class Pilot_2(db.Model):
    __tablename__ = "pilot_2"
    aid = Column(Integer, primary_key=True)
    name = Column(String(MAX_NAME_LEN))
    avatar = Column(Integer)
    attention_passed = Column(Integer)
    total_time = Column(Float)
    identity_choices = Column(JSON)
    ideologies = Column(JSON)

    ideology_answers = Column(JSON)
    additional_answers = Column(JSON)

class Pilot_3(db.Model):
    __tablename__ = "pilot_3"
    aid = Column(Integer, primary_key=True)
    attention_passed = Column(Integer)
    time_to_answer = Column(Float)
    pilot_2_ideology_label = Column(Integer)
    pilot_2_answers = Column(JSON)

class Test(db.Model):
    __tablename__ = "test"
    number = Column(Integer, primary_key=True)



@app.route("/consentform/<quiz_type>/aid=<aid>")
def consentform_with_aid(quiz_type, aid):
    return render_template('homepage.html', quiz_type=quiz_type, aid=aid)



@app.route("/consentform/<quiz_type>")
def consentform_without_aid(quiz_type):
    return render_template('homepage.html', quiz_type=quiz_type, aid=-1)



@app.route("/quiz/<quiz_type>/aid=<aid>", methods=['POST', 'GET'])
def quiz(quiz_type, aid):

    # normal quiz webpage
    if request.method == 'GET':
        return render_template('quiz.html', quiz_type=quiz_type, aid=aid)
    
    # post method after finishing the quiz
    else:
        post_data = request.get_json()
        if not post_data:
            return 'Invalid Data Submitted'
        
        if quiz_type == 'pilot_1':
            pilot_1_data = Pilot_1(aid=aid, name=post_data.name, avatar=post_data.avatar, attention_passed=post_data.attention_passed)
            db.session.add(pilot_1_data)
            db.session.commit()

        elif quiz_type == 'pilot_2':
            pilot_2_data = Pilot_2(
                aid=aid, 
                total_time=post_data.get('total_time'),
                attention_passed=post_data.get('attention_passed'),
                identity_choices=post_data.get('identity_choices'),
                ideologies=post_data.get('ideologies'),
                ideology_answers=post_data.get('type_A_answers'),
                additional_answers=post_data.get('type_D_answers')
            )
            db.session.add(pilot_2_data)
            db.session.commit()

        return 'Valid Data Submitted'



@app.route("/database_test", methods=['GET', 'POST'])
def database_test():
    if request.method == 'GET':
        return render_template('database_test.html')
    else:
        data = request.get_json()
        test = Test(number=data.get('a'))
        db.session.add(test)
        db.session.commit()
        return 'Data submitted.'
    