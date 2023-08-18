import os
from modules import getpath
from concurrent.futures import ThreadPoolExecutor
from flask import jsonify, send_file
from modules.uploading.utils import check_user_folder_existence

UPLOAD_FOLDER = "/files"
TXT_FOLDER = "/txt"

def search_keyword_in_files(currnet_username, keyword):
  check_user_folder_existence(UPLOAD_FOLDER, currnet_username)
  check_user_folder_existence(TXT_FOLDER, currnet_username)

  matching_files = []

  with ThreadPoolExecutor() as exc:
    futures = [
      exc.submit(
        search_keyword_in_file,
        os.path.join(getpath(TXT_FOLDER), currnet_username, filename),
        keyword
      ) for filename in os.listdir(os.path.join(getpath(TXT_FOLDER), currnet_username))
    ]
    for f in futures:
      if f.result():
        matching_files.append(f.result())
  
  return jsonify({'matching_files': matching_files})

def search_keyword_in_file(file_path, keyword):
  with open(file_path, 'r', encoding='utf-8') as file:
    file_content = file.read()
    if keyword.lower() in file_content.lower():
      return os.path.basename(file_path)
    

def preview_cv(current_username, pdf_filename):
  if not pdf_filename:
    return jsonify({'message': "filename can't be empty"})
  if not os.path.exists(os.path.join(getpath(UPLOAD_FOLDER), current_username, pdf_filename)):
    return jsonify({'message': f"file with name '{pdf_filename}' not exist in {current_username} account"})
  return send_file(os.path.join(getpath(UPLOAD_FOLDER), current_username, pdf_filename), mimetype='application/pdf')
  