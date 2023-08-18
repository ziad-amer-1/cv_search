from flask import jsonify, request
from modules.models.models import Client, db
import jwt
from modules.app import app
from werkzeug.security import check_password_hash
from functools import wraps

# error messages that will be displayed if any this goes wrong
INVALID_USERNAME_OR_PASSWORD = {'message': 'Username Or Password are incorrect'}, 401
NOT_FOUND = {'message': 'user not found'}, 404
INVALID_TOKEN = {'message': 'token is invalid'}, 401
MISSING_TOKEN = {'message': 'token is missing'}, 401
NOT_AUTHORIZED = {'message': 'UNAUTHORIZED'}, 401
USER_DELETED_SUCCESSFULLY = {'message': 'User deleted Successfully'}, 200

def token_required(f):
  @wraps(f)
  def decorated(*args, **kwargs):
      token = None
      if 'Authorization' in request.headers:
          token = request.headers['Authorization']
          try:
            token = token.split(" ")[1]
          except Exception:
            return INVALID_TOKEN
      if not token:
        return MISSING_TOKEN
      try:
        data = jwt.decode(
          token,
          app.config['SECRET_KEY'],
          algorithms=['HS256']
        )
        if data['is_hr'] == True:
          current_username = data['username']
          if current_username:
            return f(current_username, *args, **kwargs)
          else:
            return NOT_AUTHORIZED
        else:
          return NOT_AUTHORIZED
      except Exception as e:
        return jsonify({'message': e.__str__()})
  return decorated


def login(username, password):
  current_user = Client.query.filter_by(username=username).first()
  if not current_user:
    return INVALID_USERNAME_OR_PASSWORD
  if check_password_hash(current_user.password, password):
    if current_user.is_hr:
      token = jwt.encode(
        {'id': current_user.id, 'username': current_user.username, 'is_hr': current_user.is_hr},
        app.config['SECRET_KEY'],
        algorithm='HS256'
      )
      return jsonify({'token': f'Bearer {token}'})
    return NOT_AUTHORIZED
  return INVALID_USERNAME_OR_PASSWORD  
  


def get_all_users():
  users = []
  for user in Client.query.all():
    users.append(user.to_dict())
  return jsonify({'users': users})



def delete_user(id):
  user = Client.query.filter_by(id=id).first()
  if not user:
    return NOT_FOUND
  Client.query.filter_by(id=id).delete()
  db.session.commit()
  return USER_DELETED_SUCCESSFULLY
