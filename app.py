from flask import Flask, render_template, jsonify
from pages.login import login
from pages.mood import mood
from flask_cors import CORS
from models import db, User, guard
from flask_praetorian import auth_required, current_user
from flask_praetorian.exceptions import PraetorianError as PraetorianError

app = Flask(__name__, static_folder="build/static", template_folder="build")
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SECRET_KEY'] = 'X\x9f\xb2\x92\n\xec\x91r\xcd?\xae\x9a%\xe4\xe3\xa0\x7f[\xed\xa9\x92\x8d\x0b\x17'
app.config['JWT_ACCESS_LIFESPAN'] = {'hours': 24}
app.config['JWT_REFRESH_LIFESPAN'] = {'days': 30}

db.init_app(app)

app.register_blueprint(login, url_prefix='/login')
app.register_blueprint(mood, url_prefix='/mood')

guard.init_app(app, User)

with app.app_context():
	db.create_all()
	if db.session.query(User).filter_by(username='admin').count() < 1:
		db.session.add(User(username='admin', password=guard.hash_password('admin'), roles='admin'))
	db.session.commit()

@app.errorhandler(Exception)
def handle_exception(e):
	return index()

#@app.errorhandler(PraetorianError)
#def praetorian_error(e):
#	print("Praetorian Error")
#	return index()

@app.route("/")
def index():
	return render_template('index.html')

if __name__ == "__main__":
	app.run(host='0.0.0.0')
