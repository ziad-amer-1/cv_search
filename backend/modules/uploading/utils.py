import os
from modules import getpath
from concurrent.futures import ThreadPoolExecutor
from flask import jsonify
import fitz


ALLOWED_EXTENSIONS = {'pdf'}
UPLOAD_FOLDER = "/files"
TXT_FOLDER = "/txt"

def get_all_files_to_specific_user(current_username):
  check_user_folder_existence(UPLOAD_FOLDER, current_username)
  check_user_folder_existence(TXT_FOLDER, current_username)
  return os.listdir(os.path.join(getpath(UPLOAD_FOLDER), current_username))


def is_filename_valid_as_pdf(filename):
  return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


def check_folders_existence(dir):
  if not os.path.exists(getpath(dir)):
    os.makedirs(getpath(dir))

def check_user_folder_existence(dir, current_username):
  if not os.path.exists(os.path.join(getpath(dir), current_username)):
    os.makedirs(os.path.join(getpath(dir), current_username))

def save_files(current_username, uploaded_files):
  check_user_folder_existence(UPLOAD_FOLDER, current_username)
  check_user_folder_existence(TXT_FOLDER, current_username)
  args = [(current_username, file) for file in uploaded_files]
  with ThreadPoolExecutor() as exc:
    exc.map(save_file, args)
  return jsonify({'message': f'files uploaded successfully to {current_username}'})

def save_file(args):
  current_username, uploaded_file = args
  filename = uploaded_file.filename
  if is_filename_valid_as_pdf(filename):
    target_path_to_pdf = os.path.join(getpath(UPLOAD_FOLDER), current_username, filename)
    target_path_to_txt = os.path.join(getpath(TXT_FOLDER), current_username, filename.rsplit(".", 1)[0] + '.txt')
    uploaded_file.save(target_path_to_pdf)
    doc = fitz.open(target_path_to_pdf)
    all_page_text = [page.get_text() for page in doc]
    doc.close()
    with open(target_path_to_txt, 'w', encoding='utf-8') as txt:
      txt.write('\n'.join(all_page_text))
    # with pdfplumber.open(target_path_to_pdf) as pdf:
    #   all_page_text = [page.extract_text() for page in pdf.pages]
    #   with open(target_path_to_txt, 'w', encoding='utf-8') as txt:
    #     txt.write('\n'.join(all_page_text))

# async def extract_and_save_txt(pdf_file_path, txt_file_path):
#   with pdfplumber.open(pdf_file_path) as pdf:
#     with open(txt_file_path, 'w', encoding='utf-8') as txt:
#       for page_num in range(len(pdf.pages)):
#           current_page = pdf.pages[page_num]
#           current_page_text = current_page.extract_text()
#           txt.write(current_page_text)
#           txt.write('\n')

# async def save_file(current_username, uploaded_file):
#   filename = uploaded_file.filename
#   if is_filename_valid_as_pdf(filename):
#     target_path_to_pdf = os.path.join(getpath(UPLOAD_FOLDER), current_username, filename)
#     target_path_to_txt = os.path.join(getpath(TXT_FOLDER), current_username, filename.rsplit(".", 1)[0] + '.txt')
#     uploaded_file.save(target_path_to_pdf)
#     await extract_and_save_txt(target_path_to_pdf, target_path_to_txt)

# async def save_files(current_username, uploaded_files):
#   check_user_folder_existence(UPLOAD_FOLDER, current_username)
#   check_user_folder_existence(TXT_FOLDER, current_username)
#   tasks = []
#   for uploaded_file in uploaded_files:
#     task = save_file(current_username, uploaded_file)
#     tasks.append(task)

#   await asyncio.gather(*tasks)