from flask_restx import Resource
from .parser import authentication_model
from ..app import api
from .utils import login, get_all_users, delete_user, token_required


class Login(Resource):
  
  @api.expect(authentication_model)
  def post(self):
    payload = api.payload
    return login(payload['username'], payload['password'])

class Users(Resource):
  @token_required
  def get(_, self):
    return get_all_users()
  
class SingleUser(Resource):
  @token_required
  def delete(_, self, id):
    return delete_user(id)