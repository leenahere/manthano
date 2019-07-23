#!flask/bin/python
import os
from config import db
from models import Data

# Data to initialize database with
CODE = [
    {
        "csv": "nclbkjfacbdvs",
        "data_name": "hallo-data",
        "session_id": 143,
        "shuffle": False,
        "split": True,
        "test": 30,
        "train": 70
    },
    {
        "csv": "nclbkjfacbdvs",
        "data_name": "hallo-why",
        "session_id": 113,
        "shuffle": False,
        "split": True,
        "test": 30,
        "train": 70
    },
    {
        "csv": "nclbkjfacbdvs",
        "data_name": "hallo-more",
        "session_id": 123,
        "shuffle": False,
        "split": True,
        "test": 30,
        "train": 70
    }
]

# Delete database file if it exists currently
if os.path.exists('data.db'):
    os.remove('data.db')

# Create the database
db.create_all()

# Iterate over the PEOPLE structure and populate the database
for data in CODE:
    c = Data(session_id=data['session_id'], data_name=data['data_name'], csv=data['csv'], shuffle=data['shuffle'], split=data['split'], test=data['test'], train=data['train'])
    db.session.add(c)

db.session.commit()
