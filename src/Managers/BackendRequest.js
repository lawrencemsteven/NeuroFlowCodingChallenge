import { authFetch } from "../auth/auth";

export default class BackendRequest {
	static request_being_made = false;

	static async get(endpoint, after=()=>{}) {
		if (!BackendRequest.request_being_made) {
			BackendRequest.request_being_made = true
			let response = null

			await authFetch(endpoint, {
				method: "GET"
			}).then(res => {
				return res.json();
			}).then(data => {
				response = data
			})

			BackendRequest.request_being_made = false;
			after(response)
		}
	}

	static async post(endpoint, data, after=()=>{}) {
		if (!BackendRequest.request_being_made) {
			BackendRequest.request_being_made = true
			let response = null

			await authFetch(endpoint, {
				method: "POST",
				headers: {'Content-Type': 'application/json'},
				body: JSON.stringify(data)
			}).then(res => {
				return res.json();
			}).then(data => {
				response = data
			})

			BackendRequest.request_being_made = false;
			after(response)
		}
	}
}