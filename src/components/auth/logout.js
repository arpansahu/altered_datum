import React, { useEffect } from 'react';
import axiosInstance from '../../axios';
import { useNavigate } from 'react-router-dom';

export default function Logout() {
	const history = useNavigate();

	useEffect(() => {
		const logout = async () => {
			try {
				await axiosInstance.post('user/logout/blacklist/', {
					refresh_token: localStorage.getItem('refresh_token'),
				});
				localStorage.removeItem('access_token');
				localStorage.removeItem('refresh_token');
				axiosInstance.defaults.headers['Authorization'] = null;
				history.push('/login');
			} catch (error) {
				console.error("Logout failed", error);
				// Optionally handle the error, e.g., notify the user or retry
			}
		};

		logout();
	}, [history]);

	return <div>Logging out...</div>;
}