from config import db, ma
from flask_sqlalchemy import event
import os

DIRNAME = os.path.dirname(__file__)


class Data(db.Model):
    __tablename__ = 'data'
    data_id = db.Column(db.Integer, primary_key=True)
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

