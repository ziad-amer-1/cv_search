"""
  creating request parser to parse and valide HTTP requests
"""

from flask_restx import fields, reqparse
from modules.app import api

authentication_model = api.model('authentication',
                                 {'username': fields.String('username'),
                                  'password': fields.String('password')})

# client_parser = reqparse.RequestParser()
# client_parser.add_argument('username', type=str, required=True, location='form', help='username is required')
