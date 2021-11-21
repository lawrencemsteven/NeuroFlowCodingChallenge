import React, { useState, useEffect } from 'react'
import './Login.scss'
import { Link, useNavigate } from "react-router-dom";
import BackendRequest from "../../Managers/BackendRequest"
import ProfileManager from "../../Managers/ProfileManager"
import { login } from "../../auth/auth"

export default function Login({create_account}) {
	const navigate = useNavigate();
	const [error, setError] = useState(0)
	const [username, setUsername] = useState("")
	const [password, setPassword] = useState("")
	const [confirmPassword, setConfirmPassword] = useState("")

	function formSubmit(evt) {
		evt.preventDefault()

		ProfileManager.username = evt.target[0].value

		let data = {
			username: ProfileManager.username,
			password: evt.target[1].value
		}

		if (create_account) {
			if (password === confirmPassword) {
				BackendRequest.post('/login/signup', data, (data) => {
					if (data.signed_in) {
						login(data.access_token)
						ProfileManager.logged_in = true;
						navigate("/mood");
					} else {
						setError(-3)
					}
				})
			} else {
				setError(-2)
			}
		} else {
			BackendRequest.post('/login/', data, (data) => {
				if (data.signed_in) {
					login(data.access_token)
					ProfileManager.logged_in = true;
					navigate("/mood");
				} else {
					setError(-1)
				}
			});
		}
	}

	useEffect(() => {
		if (!create_account) {
			BackendRequest.get("/login/signed_in", (data)=>{
				if (data.signed_in) {
					ProfileManager.logged_in = true;
					ProfileManager.username = data.username;
					navigate("/mood")
				}
			});
		}
	}, [navigate, create_account])

	let error_jsx = (<></>);
	if (error === -1) {
		error_jsx = (
			<label>Invalid Username Or Password!</label>
		)
	} else if (error === -2) {
		error_jsx = (
			<label>Passwords Do Not Match!</label>
		)
	} else if (error === -3) {
		error_jsx = (
			<label>Username Already In Use!</label>
		)
	}
	if (error !== 0) {
		error_jsx = (
			<div>
				{error_jsx}
				<input type="button" value="X" onClick={() => {setError(0)}}/>
			</div>
		)
	}

	if (create_account) {
		return (
			<div>
				{error_jsx}
				<form onSubmit={(evt) => {formSubmit(evt)}}>
					<label>Username:</label>
					<input type="text" id="username" onChange={(evt) => {setUsername(evt.target.value)}} value={username} />

					<label>Password:</label>
					<input type="password" id="password" onChange={(evt) => {setPassword(evt.target.value)}} value={password} />

					<label>Confirm Password:</label>
					<input type="password" id="confirmPassword" onChange={(evt) => {setConfirmPassword(evt.target.value)}} value={confirmPassword} />

					<input type="submit" />
				</form>
				<label>Already have an account?</label><Link to="/login">Log In!</Link>
			</div>
		)
	}

	return (
		<div>
			{error_jsx}
			<form onSubmit={(evt) => {formSubmit(evt)}}>
				<label>Username:</label>
				<input type="text" id="username" onChange={(evt) => {setUsername(evt.target.value)}} value={username} />

				<label>Password:</label>
				<input type="password" id="password" onChange={(evt) => {setPassword(evt.target.value)}} value={password} />

				<input type="submit" />
			</form>
			<label>Don't have an account?</label><Link to="/signup">Sign Up!</Link>
		</div>
	)
}
