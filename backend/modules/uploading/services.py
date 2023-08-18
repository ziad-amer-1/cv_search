from flask_restx import Resource
from modules.users.utils import token_required
from .utils import get_all_files_to_specific_user, save_files
from .parser import files_parser
from modules.app import api

class Uploading(Resource):
  @token_required
  def get(current_username, self):
    return get_all_files_to_specific_user(current_username) 
  
  @token_required
  @api.expect(files_parser)
  def post(current_username, self):
    args = files_parser.parse_args()
    files = args['files']
    return save_files(current_username, files)