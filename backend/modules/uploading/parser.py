from flask_restx import fields, reqparse
from modules.app import api
from werkzeug.datastructures import FileStorage

files_parser = reqparse.RequestParser()

files_parser.add_argument('files', location='files', type=FileStorage, action='append', required=True)