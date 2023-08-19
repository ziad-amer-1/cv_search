from flask import Flask
from flask_restx.api import Api
from flask_cors import CORS
from sqlalchemy import create_engine
from modules import getpath

authorizations = {
  'Bearer Auth': {
    'type': 'apiKey',
    'in': 'header',
    'name': 'Authorization'
  }
}

app = Flask(__name__)

# read config from our (app.cfg) file under config folder
app.config.from_pyfile(getpath('/config/app.cfg'))

# Init flask restx to be able to make REST APIs
api = Api(app=app, security='Bearer Auth', authorizations=authorizations)

if app.config['ENABLE_CORS']:
  CORS(app, resources={r'/*': {'origins': '*'}})

app.config['MAX_CONTENT_LENGTH'] = 1000 * 1024 * 1024

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + getpath("/database/cv.db")
db_engine = create_engine(app.config['SQLALCHEMY_DATABASE_URI'])
