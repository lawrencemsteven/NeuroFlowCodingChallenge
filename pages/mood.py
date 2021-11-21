from flask import Blueprint, request, jsonify
from flask_praetorian import auth_required, current_user
from datetime import datetime, timedelta
import sys
import os
sys.path.insert(1, os.path.join("..",".."))
from models import db, User, Mood

mood = Blueprint("moods", __name__)


@mood.route("/", methods=["GET", "POST"])
@auth_required
def get_moods():
	user = current_user()
	posted = datetime.now()
	if (len(user.moods) > 0):
		last_mood_date = user.moods[-1].posted.date()
		current_date = posted.date()
		yesterday = current_date - timedelta(days=1)

		if last_mood_date < yesterday:
			user.streak = 1
			db.session.commit()
	
	if request.method == 'POST':
		mood_value = request.json['current_mood']
		if (0 <= mood_value <= 7):
			if (len(user.moods) == 0):
				user.streak = 1
			elif yesterday == last_mood_date:
				user.streak += 1
			new_mood = Mood(user_id=user.identity, posted=posted, value=mood_value)
			user.moods.append(new_mood)
			db.session.commit()

	all_moods = []
	for mood in reversed(user.moods):
		all_moods.append(mood.json())
	
	return jsonify({"moods": all_moods, "streak": user.streak})