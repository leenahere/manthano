#!flask/bin/python
import os
from config import db
from models import RobotCode

# Data to initialize database with
CODE = [
    {'robot': 'b07', 'code': 'Farrell'},
    {'robot': 'b08', 'code': 'Brockman'},
    {'robot': 'b09','code': 'Easter'}
]

# Delete database file if it exists currently
if os.path.exists('robotcode.db'):
    os.remove('robotcode.db')

# Create the database
db.create_all()

# Iterate over the PEOPLE structure and populate the database
for robotcode in CODE:
    c = RobotCode(robot=robotcode['robot'], code=robotcode['code'])
    db.session.add(c)

db.session.commit()
