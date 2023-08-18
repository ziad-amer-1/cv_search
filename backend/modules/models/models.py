"""
  what you will see in this file 
  1 - init sqlalchemy
  2 - create models (tables) 
"""

from flask_sqlalchemy import SQLAlchemy
from ..app import app

# Init sqlalchemy
db = SQLAlchemy(app)

class Client(db.Model):
  id = db.Column(db.Integer, primary_key=True, unique=True)
  username = db.Column(db.String(30), unique=True)
  password = db.Column(db.String(100))
  is_hr = db.Column(db.Boolean)

  def to_dict(self):
    return {
      'id': self.id,
      'username': self.username,
      'password': self.password,
      'is_hr': self.is_hr
    }

