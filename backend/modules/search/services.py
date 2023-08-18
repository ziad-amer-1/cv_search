from flask_restx import Resource
from modules.users.utils import token_required
from flask import request, jsonify
from .utils import search_keyword_in_files, preview_cv

class Search(Resource):

  @token_required
  def get(current_username, self):
    keyword = request.args.get('keyword', '')
    if not keyword:
      return jsonify({"message": "keyword is empty"})
    return search_keyword_in_files(current_username, keyword)
  

class PreviewPdf(Resource):

  @token_required
  def get(current_user, self):
    pdf_filename = request.args.get('filename', '')
    return preview_cv(current_user, pdf_filename) 