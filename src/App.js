import React from 'react'
import Login from './Pages/Login/Login';
import Mood from './Pages/Mood/Mood';
import ProfileManager from "./Managers/ProfileManager"
import {
	Routes,
	Route,
	Navigate,
	useLocation
} from "react-router-dom";

export default function App() {
	const location = useLocation();

	if (!ProfileManager.logged_in && location.pathname !== '/login' && location.pathname !== '/signup') {
		return (<Navigate to="/login" />)
	}

	return (
		<Routes>
			<Route exact path="/" element={<Navigate to="/login" />} />
			<Route exact path="/login" element={<Login create_account={false} />} />
			<Route exact path="/signup" element={<Login create_account={true} />} />
			<Route exact path="/mood" element={<Mood />} />
		</Routes>
	)
}
