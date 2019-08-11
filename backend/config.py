#!flask/bin/python
import os
import connexion
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow

basedir = os.path.abspath(os.path.dirname(__file__))

db_username = 'postgres'
db_password = ''
db_name = 'manthano'
db_hostname = '127.0.0.1'

# Create the Connexion application instance
connex_app = connexion.App(__name__, specification_dir=basedir)

# Get the underlying Flask app instance
app = connex_app.app

CORS(app)

# Configure the SQLAlchemy part of the app instance
app.config['SQLALCHEMY_ECHO'] = True
#app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:////' + os.path.join(basedir, 'manthano.db')
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://{DB_USER}:{DB_PASS}@{DB_ADDR}/{DB_NAME}'.format(DB_USER=db_username,
                                                                                        DB_PASS=db_password,
                                                                                        DB_ADDR=db_hostname,
                                                                                        DB_NAME=db_name)

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Create the SQLAlchemy db instance
db = SQLAlchemy(app)

# Initialize Marshmallow
ma = Marshmallow(app)
