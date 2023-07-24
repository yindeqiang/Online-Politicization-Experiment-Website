from crypt import methods
from email import header
import time
from flask import Flask, render_template, request, url_for, send_from_directory, redirect
import json, os
from itsdangerous import exc
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, String, JSON, Float

MAX_ID_LEN = 100

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
    participantId = Column(String(MAX_ID_LEN), primary_key=True)
    assignmentId = Column(String(MAX_ID_LEN))
    projectId = Column(String(MAX_ID_LEN))
    attention_passed = Column(Integer)
    total_time = Column(Float)

class Pilot_1(Base):
    __tablename__ = "pilot_1"
    identity_choices = Column(JSON)
    ideologies = Column(JSON)
    ideology_answers = Column(JSON)
    additional_answers = Column(JSON)

class Pilot_2(Base):
    __tablename__ = "pilot_2"
    pilot_2_answers = Column(JSON)
    ideology_label = Column(Integer)




# default webpage, condition 2
@app.route("/")
def homepage():
    return redirect('/condition_2')



@app.route("/<string:quiz_type>")
def consentform(quiz_type):
    participantId = request.args.get('participantId', default="")
    assignmentId = request.args.get('assignmentId', default="")
    projectId = request.args.get('projectId', default="")
    idExisted = False
    if quiz_type == 'pilot_1':
        idExisted = Pilot_1.query.filter_by(participantId=participantId).first() is not None
    elif quiz_type == 'pilot_2':
        idExisted = Pilot_2.query.filter_by(participantId=participantId).first() is not None

    return render_template('consentform.html', quiz_type=quiz_type, participantId=participantId, assignmentId=assignmentId, projectId=projectId, idExisted=idExisted)



@app.route('/<string:quiz_type>/quiz', methods=['POST', 'GET'])
def quiz(quiz_type):

    # normal quiz webpage
    if request.method == 'GET':
        participantId = request.args.get('participantId', default="")
        assignmentId = request.args.get('assignmentId', default="")
        projectId = request.args.get('projectId', default="")
        idExisted = False
        if quiz_type == 'pilot_1':
            idExisted = Pilot_1.query.filter_by(participantId=participantId).first() is not None
        elif quiz_type == 'pilot_2':
            idExisted = Pilot_2.query.filter_by(participantId=participantId).first() is not None

        return render_template('quiz.html', quiz_type=quiz_type, participantId=participantId, assignmentId=assignmentId, projectId=projectId, idExisted=idExisted)

    # post method after finishing the quiz
    else:
        post_data = request.get_json()
        if not post_data:
            return 'Invalid Data Submitted'

        with open(f'data/{quiz_type}.json', 'r') as file:
            existing_data = json.load(file)
            existing_data.append(post_data)

        with open(f'data/{quiz_type}.json', 'w') as file:
            json.dump(existing_data, file, indent=4)

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
