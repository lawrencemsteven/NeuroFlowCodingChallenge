from flask import jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_praetorian import Praetorian
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()
guard = Praetorian()

class User(db.Model):
	__tablename__ = "users"

	id = db.Column(db.Integer, primary_key=True)
	username = db.Column(db.Text, unique=True, nullable=False)
	password = db.Column(db.Text, nullable=False)
	streak = db.Column(db.Integer, nullable=False, default=0)
	is_active = db.Column(db.Boolean, default=True)
	roles = db.Column(db.Text)
	moods = db.relationship("Mood", backref='user')

	def set_password(self, password):
		self.password = guard.hash_password(password)

	@property
	def rolenames(self):
		try:
			return self.roles.split(',')
		except Exception:
			return []

	@classmethod
	def lookup(cls, username):
		return cls.query.filter_by(username=username).one_or_none()

	@classmethod
	def identify(cls, id):
		return cls.query.get(id)

	@property
	def identity(self):
		return self.id

	def is_valid(self):
		return self.is_active


class Mood(db.Model):
	__tablename__ = "moods"

	id = db.Column(db.Integer(), primary_key=True)
	user_id = db.Column(db.Integer(), db.ForeignKey('users.id'))
	value = db.Column(db.Integer())
	posted = db.Column(db.DateTime, nullable=False)

	def json(self):
		return {"value": self.value, "posted": self.posted.strftime("%m/%d/%Y, %H:%M:%S")}