from flask import Flask, render_template, jsonify
from pages.login import login
from pages.mood import mood
from flask_cors import CORS
from models import db, User, guard
from flask_praetorian import auth_required, current_user

app = Flask(__name__, static_folder="build/static", template_folder="build")
CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
app.config['SECRET_KEY'] = '\xd2\xe9sxkk\xb4\xd1\xd3$\xd2U\xf8F)\xd5W\x8eo\xb4\x18\x864J'
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

@app.route("/")
def index():
	return render_template('index.html')

if __name__ == "__main__":
	app.run(host='0.0.0.0')