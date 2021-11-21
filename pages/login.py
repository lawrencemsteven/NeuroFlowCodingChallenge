from flask import Blueprint, request, jsonify
from flask_praetorian import current_user, auth_required
import sys
import os
sys.path.insert(1, os.path.join("..",".."))
from models import db, User, guard

login = Blueprint("login", __name__)


@login.route("/", methods=["POST"])
def index():
	req = request.get_json(force=True)
	username = req.get('username', None)
	password = req.get('password', None)
	user = guard.authenticate(username, password)
	
	return jsonify({'signed_in': True, 'access_token': guard.encode_jwt_token(user)})


@login.route("/refresh", methods=["POST"])
def refresh():
	old_token = request.get_data()
	new_token = guard.refresh_jwt_token(old_token)
	ret = {'access_token': new_token}
	return ret, 200


@login.route("/signup", methods=["POST"])
def signup():
	req = request.get_json(force=True)
	username = req.get('username', None)
	password = req.get('password', None)
	user = User(username=username)
	user.set_password(password)
	db.session.add(user)
	try:
		db.session.commit()
	except:
		return jsonify({'signed_in': False, })
	user = guard.authenticate(username, password)
	
	return jsonify({'signed_in': True, 'access_token': guard.encode_jwt_token(user)})


@login.route("/signed_in", methods=["GET"])
@auth_required
def signed_in():
	return {"signed_in": True, "username": current_user().username}