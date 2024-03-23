from email import header
import time
from flask import Flask, render_template, request, url_for, send_from_directory, redirect, jsonify
import json, os
from itsdangerous import exc
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Column, Integer, String, JSON, Float, DateTime
from datetime import datetime

MAX_ID_LEN = 100
MAX_REASON_LEN = 200

app = Flask(__name__)
app.config["DEBUG"] = False

# database connection configuration
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
if not app.config["DEBUG"]:
    class Base(db.Model):
        __abstract__ = True
        participantId = Column(String(MAX_ID_LEN), primary_key=True)
        assignmentId = Column(String(MAX_ID_LEN))
        projectId = Column(String(MAX_ID_LEN))
        attention_passed = Column(Integer)
        total_time = Column(Float)
        identity_choices = Column(JSON)
        ideologies = Column(JSON)
        bot_detected = Column(Integer)
        submit_time=Column(DateTime)
        reason = Column(String(MAX_REASON_LEN))

    class Pilot_1(Base):
        __tablename__ = "pilot_1"
        ideology_answers = Column(JSON)
        additional_answers = Column(JSON)

    class Pilot_2(Base):
        __tablename__ = "pilot_2"
        pilot_2_answers = Column(JSON)
        ideology_label = Column(Float)

    class Condition_1(Base):
        __tablename__ = "condition_1"
        non_ideology_answers = Column(JSON)
        additional_answers = Column(JSON)
    
    class Condition_2(Base):
        __tablename__ = "condition_2"
        ideology_answers = Column(JSON)
        non_ideology_answers = Column(JSON)
        additional_answers = Column(JSON)
        labels = Column(JSON)
        
    class Condition_3(Base):
        __tablename__ = "condition_3"
        ideology_answers = Column(JSON)
        non_ideology_answers = Column(JSON)
        additional_answers = Column(JSON)
        labels = Column(JSON)


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
    if not app.config["DEBUG"]:
        if quiz_type == 'pilot_1':
            idExisted = Pilot_1.query.filter_by(participantId=participantId).first() is not None
        elif quiz_type == 'pilot_2' or quiz_type == "pilot_2_2":
            idExisted = Pilot_2.query.filter_by(participantId=participantId).first() is not None
        elif quiz_type == 'condition_1':
            idExisted = Condition_1.query.filter_by(participantId=participantId).first() is not None
        elif quiz_type == 'condition_2':
            idExisted = Condition_2.query.filter_by(participantId=participantId).first() is not None
        else:
            idExisted = Condition_3.query.filter_by(participantId=participantId).first() is not None
    return render_template('consentform.html', quiz_type=quiz_type, participantId=participantId, assignmentId=assignmentId, projectId=projectId, idExisted=idExisted)



@app.route('/<string:quiz_type>/quiz', methods=['POST', 'GET'])
def quiz(quiz_type):
    # normal quiz webpage
    if request.method == 'GET':
        participantId = request.args.get('participantId', default="")
        assignmentId = request.args.get('assignmentId', default="")
        projectId = request.args.get('projectId', default="")
        idExisted = False
        if not app.config["DEBUG"]:
            if quiz_type == 'pilot_1':
                idExisted = Pilot_1.query.filter_by(participantId=participantId).first() is not None
            elif quiz_type == 'pilot_2' or quiz_type == "pilot_2_2":
                idExisted = Pilot_2.query.filter_by(participantId=participantId).first() is not None
            elif quiz_type == 'condition_1':
                idExisted = Condition_1.query.filter_by(participantId=participantId).first() is not None
            elif quiz_type == 'condition_2':
                idExisted = Condition_2.query.filter_by(participantId=participantId).first() is not None
            elif quiz_type == 'condition_3':
                idExisted = Condition_3.query.filter_by(participantId=participantId).first() is not None
        return render_template('quiz.html', quiz_type=quiz_type, participantId=participantId, assignmentId=assignmentId, projectId=projectId, idExisted=idExisted)

    # post method after finishing the quiz
    elif not app.config["DEBUG"]:
        try:
            post_data = request.get_json()

        except ValueError:
            return jsonify({'message': 'Cannot extract json data'}), 400

        try:
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
                    additional_answers=post_data.get('type_D_answers'),
                    bot_detected=post_data.get('bot_detected'),
                    submit_time=datetime.now(),
                    reason=post_data.get("reason")
                )
                db.session.add(pilot_1_data)

            elif quiz_type == 'pilot_2' or quiz_type == "pilot_2_2":
                pilot_2_data = Pilot_2(
                    participantId=post_data.get('participantId'),
                    assignmentId=post_data.get('assignmentId'),
                    projectId=post_data.get('projectId'),
                    total_time=post_data.get('total_time'),
                    attention_passed=post_data.get('attention_passed'),
                    pilot_2_answers=post_data.get('pilot_2_answers'),
                    ideology_label=post_data.get('ideology_label'),
                    bot_detected=0 if quiz_type == "pilot_2" else 1,
                    submit_time=datetime.now()
                )
                db.session.add(pilot_2_data)

            elif quiz_type == 'condition_1':
                condition_1_data = Condition_1(
                    participantId=post_data.get('participantId'),
                    assignmentId=post_data.get('assignmentId'),
                    projectId=post_data.get('projectId'),
                    total_time=post_data.get('total_time'),
                    attention_passed=post_data.get('attention_passed'),
                    non_ideology_answers=post_data.get('type_B_answers'),
                    additional_answers=post_data.get('type_D_answers'),
                    submit_time=datetime.now(),
                    identity_choices=post_data.get("identity_choices"),
                    bot_detected=post_data.get("bot_detected"),
                    reason=post_data.get("reason"),
                    ideologies=post_data.get('ideologies'),
                )
                db.session.add(condition_1_data)
            
            elif quiz_type == 'condition_2':
                condition_2_data = Condition_2(
                    participantId=post_data.get('participantId'),
                    assignmentId=post_data.get('assignmentId'),
                    projectId=post_data.get('projectId'),
                    total_time=post_data.get('total_time'),
                    attention_passed=post_data.get('attention_passed'),
                    ideology_answers=post_data.get("type_A_answers"),
                    non_ideology_answers=post_data.get('type_B_answers'),
                    additional_answers=post_data.get('type_D_answers'),
                    labels=post_data.get("labels"),
                    submit_time=datetime.now(),
                    identity_choices=post_data.get("identity_choices"),
                    bot_detected=post_data.get("bot_detected"),
                    reason=post_data.get("reason"),
                    ideologies=post_data.get('ideologies'),
                )
                db.session.add(condition_2_data)
            
            else:
                condition_3_data = Condition_3(
                    participantId=post_data.get('participantId'),
                    assignmentId=post_data.get('assignmentId'),
                    projectId=post_data.get('projectId'),
                    total_time=post_data.get('total_time'),
                    attention_passed=post_data.get('attention_passed'),
                    ideology_answers=post_data.get("type_A_answers"),
                    non_ideology_answers=post_data.get('type_B_answers'),
                    additional_answers=post_data.get('type_D_answers'),
                    labels=post_data.get("labels"),
                    submit_time=datetime.now(),
                    identity_choices=post_data.get("identity_choices"),
                    bot_detected=post_data.get("bot_detected"),
                    reason=post_data.get("reason"),
                    ideologies=post_data.get('ideologies'),
                )
                db.session.add(condition_3_data)

            db.session.commit()
            return jsonify({'message':'Valid data submitted'}), 200

        except Exception as e:
            raw_data = request.get_data(as_text=True)
            with open(f'data/{quiz_type}.txt', 'a') as file:
                file.write(raw_data + '\n')
            return jsonify({'error': f'Cannot write data to database, {str(e)}'}), 400
