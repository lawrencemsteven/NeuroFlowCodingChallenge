import React, { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom";
import BackendRequest from '../../Managers/BackendRequest'
import { MOOD_ARRAY } from '../../Managers/MoodManager'
import { logout } from '../../auth/auth'

export default function Mood() {
	const navigate = useNavigate();
	const [currentMood, setCurrentMood] = useState(-1)
	const [moods, setMoods] = useState(null)
	const [streak, setStreak] = useState(null)
	let moods_to_show = []
	let streak_to_show = -1

	function formSubmit(evt) {
		evt.preventDefault()

		let data = {
			current_mood: currentMood,
		}
		
		BackendRequest.post('/mood/', data, (data) => {
			setMoods(data.moods)
			setStreak(data.streak)
		})
	}

	useEffect(() => {
		if (moods === null) {
			BackendRequest.get("/mood/", (data)=>{
				setMoods(data.moods)
				setStreak(data.streak)
			});
		}
	}, [moods])

	if (moods !== null) {
		moods_to_show = moods
		streak_to_show = streak
	}

	return (
		<div>
			<input type="button" onClick={() => {logout(); navigate("/login")}} value={"Logout"} />
			<form onSubmit={(evt) => {formSubmit(evt)}}>
				<div className="moodSelector">
					{MOOD_ARRAY.map((mood, index) => {
						return (
							<div key={index} onClick={() => {currentMood === index ? setCurrentMood(-1) : setCurrentMood(index)}} className={"moodBox" + (currentMood === index ? " active" : "")}>{mood}</div>
						)
					})}
				</div>
				<input disabled={currentMood === -1} type="submit" />
			</form>
			<div className="streak">Streak: {streak_to_show}</div>
			<div className="moodTable">
				{moods_to_show.map((mood, index) => {
					return (
						<div key={index} className="row">
							<div className="col_0">{MOOD_ARRAY[mood.value]}</div>
							<div className="col_1">{mood.posted}</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}
