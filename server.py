from crypt import methods
from email import header
import time
from flask import Flask, render_template, request, url_for, send_from_directory, redirect
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

# base database
class Base(db.Model):
    __abstract__ = True
    participantId = Column(Integer, primary_key=True)
    assignmentId = Column(Integer)
    projectId = Column(Integer)
    attention_passed = Column(Integer)
    total_time = Column(Float)

class Pilot_1(Base):
    __tablename__ = "pilot_1"
    identity_choices = Column(JSON)
    ideologies = Column(JSON)
    ideology_answers = Column(JSON)
    additional_answers = Column(JSON)

class Pilot_2(Base):
    pilot_2_answers = Column(JSON)
    ideology_label = Column(Integer)

class Pilot_3(Base):
    __tablename__ = "pilot_3"
    aid = Column(Integer, primary_key=True)
    attention_passed = Column(Integer)
    time_to_answer = Column(Float)
    pilot_2_ideology_label = Column(Integer)
    pilot_2_answers = Column(JSON)



# default webpage, condition 2
@app.route("/")
def homepage():
    return redirect('/condition_2')



@app.route("/<string:quiz_type>")
def consentform(quiz_type):
    participantId = request.args.get('participantId', default=-1)
    assignmentId = request.args.get('assignmentId', default=-1)
    projectId = request.args.get('projectId', default=-1)
    return render_template('consentform.html', quiz_type=quiz_type, participantId=participantId, assignmentId=assignmentId, projectId=projectId)



@app.route('/<string:quiz_type>/quiz', methods=['POST', 'GET'])
def quiz(quiz_type):

    # normal quiz webpage
    if request.method == 'GET':
        participantId = request.args.get('participantId', default=-1)
        assignmentId = request.args.get('assignmentId', default=-1)
        projectId = request.args.get('projectId', default=-1)
        return render_template('quiz.html', quiz_type=quiz_type, participantId=participantId, assignmentId=assignmentId, projectId=projectId)

    # post method after finishing the quiz
    else:
        post_data = request.get_json()
        if not post_data:
            return 'Invalid Data Submitted'

        if quiz_type == 'pilot_1':
            pilot_1_data = Pilot_1(
                participantId=post_data.get('participantId'),
                assignmentId=post_data.get('assignmentId'),
                projectId=post_data.get('projectId'),
                total_time=post_data.get('total_time'),
                attention_passed=post_data.get('attention_passed'),
                identity_choices=post_data.get('identity_choices'),
                ideologies=post_data.get('ideologies'),
                ideology_answers=post_data.get('type_A_answers'),
                additional_answers=post_data.get('type_D_answers')
            )
            db.session.add(pilot_1_data)
            db.session.commit()

        elif quiz_type == 'pilot_2':
            pilot_2_data = Pilot_2(
                participantId=post_data.get('participantId'),
                assignmentId=post_data.get('assignmentId'),
                projectId=post_data.get('projectId'),
                total_time=post_data.get('total_time'),
                attention_passed=post_data.get('attention_passed'),
                pilot_2_answers=post_data.get('pilot_2_answers'),
                ideology_label=post_data.get('ideology_label')
            )
            db.session.add(pilot_2_data)
            db.session.commit()

        return 'Valid Data Submitted'
