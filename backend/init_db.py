from modules import getpath
from modules.models.models import db, Client
from werkzeug.security import generate_password_hash
from modules.app import app

def init_db():
  mega_dev_account = Client(
    username='megadev',
    password=generate_password_hash('megadev', method='scrypt'),
    is_hr=True
  )
  business_engines_account = Client(
    username='businessengines',
    password=generate_password_hash('businessengines', method='scrypt'),
    is_hr=True
  )

  with app.app_context():
    db.drop_all()
    db.create_all()
    db.session.add(mega_dev_account)
    db.session.add(business_engines_account)
    db.session.commit()


if __name__ == '__main__':
  print('WARNING: Database will be reset and all data will be deleted')
  answer = input('Would you like to continue? (yes, [no])')
  if answer == 'yes':
    init_db()
    print('Database has been reset.')
  else:
    print('Did not get the confirmation, Skipping.')