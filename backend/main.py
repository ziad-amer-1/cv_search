from modules.app import app, api
from modules.models.models import db
import modules.users.services as user_service
import modules.uploading.services as uploading_service
import modules.search.services as search_service
from modules.uploading.utils import check_folders_existence

UPLOAD_FOLDER = "/files"
TXT_FOLDER = "/txt"
ENDPOINT_PREFIX = '/api/v1'

check_folders_existence(UPLOAD_FOLDER)
check_folders_existence(TXT_FOLDER)

api.add_resource(user_service.Login, f'{ENDPOINT_PREFIX}/users/login')
api.add_resource(user_service.Users, f'{ENDPOINT_PREFIX}/users')
api.add_resource(user_service.SingleUser, f'{ENDPOINT_PREFIX}/users/<int:id>')

api.add_resource(uploading_service.Uploading, f'{ENDPOINT_PREFIX}/files')

api.add_resource(search_service.Search, f'{ENDPOINT_PREFIX}/files/search')
api.add_resource(search_service.PreviewPdf, f'{ENDPOINT_PREFIX}/files/preview_pdf')


if __name__ == '__main__':
  with app.app_context():
    db.create_all()
  app.run(host="0.0.0.0", debug=True, threaded=True)