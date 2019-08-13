from config import db, ma
from flask_sqlalchemy import event
from git import Repo
import os

DIRNAME = os.path.dirname(__file__)
PATH_OF_GIT_REPO = os.path.join(DIRNAME, "./../../server-thesis/.git")  # make sure .git folder is properly configured
COMMIT_MESSAGE = 'comment from python script'

class RobotCode(db.Model):
    __tablename__ = 'robotcode'
    robot_id = db.Column(db.Integer, primary_key=True)
    robot = db.Column(db.String(32), index=True)
    code = db.Column(db.String(32))


class Data(db.Model):
    __tablename__ = 'data'
    data_id = db.Column(db.Integer, primary_key=True)
    #  I need something to connect data objects to robot/session. This is just a temporary solution
    session_id = db.Column(db.String)
    data_name = db.Column(db.String(32), index=True)
    csv = db.Column(db.String)
    scale = db.Column(db.String)
    shuffle = db.Column(db.Boolean)
    test = db.Column(db.Integer)
    train = db.Column(db.Integer)
    features = db.Column(db.ARRAY(db.Integer))
    labels = db.Column(db.ARRAY(db.Integer))
    delimiter = db.Column(db.String)


class ExampleData(db.Model):
    __tablename__ = 'exampledata'
    data_id = db.Column(db.Integer, primary_key=True)
    data_name = db.Column(db.String)
    csv = db.Column(db.String)
    features = db.Column(db.ARRAY(db.Integer))
    labels = db.Column(db.ARRAY(db.Integer))
    delimiter = db.Column(db.String)


class ExampleDataSchema(ma.ModelSchema):
    class Meta:
        model = ExampleData
        sqla_session = db.session


class DataSchema(ma.ModelSchema):
    class Meta:
        model = Data
        sqla_session = db.session


class RobotCodeSchema(ma.ModelSchema):
    class Meta:
        model = RobotCode
        sqla_session = db.session


@db.event.listens_for(RobotCode, "after_update")
def after_update(mapper, connection, target):
    link_table = RobotCode.__table__
    my_path = os.path.dirname(__file__)
    path = os.path.join(my_path, "./../../server-thesis/code/test.py")

    f = open(path, 'w+')
    f.write(target.code)
    f.close()

    try:
        repo = Repo(PATH_OF_GIT_REPO)
        repo.git.add(update=True)
        repo.index.commit(COMMIT_MESSAGE)
        origin = repo.remote(name='origin')
        origin.push()
    except:
        print('Some error occured while pushing the code')
