#!flask/bin/python
import os
from config import db
from models import Data, RobotCode

# Data to initialize database with
DATA = [
    {
        "csv": "nclbkjfacbdvs",
        "data_name": "hallo-data",
        "session_id": 143,
        "shuffle": False,
        "scale": False,
        "test": 30,
        "train": 70
    },
    {
        "csv": "nclbkjfacbdvs",
        "data_name": "hallo-why",
        "session_id": 113,
        "shuffle": False,
        "scale": True,
        "test": 30,
        "train": 70
    },
    {
        "csv": "nclbkjfacbdvs",
        "data_name": "hallo-more",
        "session_id": 123,
        "shuffle": False,
        "scale": True,
        "test": 30,
        "train": 70
    }
]

CODE = [
    {'robot': 'b07', 'code': 'Farrell'},
    {'robot': 'b08', 'code': 'Brockman'},
    {'robot': 'b09','code': 'Easter'}
]

# Delete database file if it exists currently
#if os.path.exists('data.db'):
#    print('exists')
#    os.remove('data.db')

# Create the database
#db.create_all()

print(db.metadata.tables.keys())

db.drop_all()

print(db.metadata.tables.keys())

db.create_all()

# Iterate over the PEOPLE structure and populate the database
for data in DATA:
    c = Data(session_id=data['session_id'], data_name=data['data_name'], csv=data['csv'], shuffle=data['shuffle'], scale=data['scale'], test=data['test'], train=data['train'])
    db.session.add(c)

for robotcode in CODE:
    c = RobotCode(robot=robotcode['robot'], code=robotcode['code'])
    db.session.add(c)

db.session.commit()
