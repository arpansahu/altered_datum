import axios from 'axios';

const base_url = process.env.REACT_APP_API_BASE_URL;
const baseURL = `${base_url}/api/`;

const axiosInstance = axios.create({
	baseURL: baseURL,
	timeout: 5000,
	headers: {
		Authorization: localStorage.getItem('access_token')
			? `Bearer ${localStorage.getItem('access_token')}`
			: null,
		'Content-Type': 'application/json',
		accept: 'application/json',
	},
});

axiosInstance.interceptors.response.use(
	(response) => {
		return response;
	},
	async (error) => {
		const originalRequest = error.config;

		if (!error.response) {
			alert(
				'A server/network error occurred. ' +
					'Looks like CORS might be the problem. ' +
					'Sorry about this - we will get it fixed shortly.'
			);
			return Promise.reject(error);
		}

		if (
			error.response.status === 401 &&
			originalRequest.url === `${baseURL}token/refresh/`
		) {
			window.location.href = '/login/';
			return Promise.reject(error);
		}

		if (
			error.response.data.code === 'token_not_valid' &&
			error.response.status === 401 &&
			error.response.statusText === 'Unauthorized'
		) {
			const refreshToken = localStorage.getItem('refresh_token');

			if (refreshToken) {
				const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]));

				// exp date in token is expressed in seconds, while now() returns milliseconds:
				const now = Math.ceil(Date.now() / 1000);

				if (tokenParts.exp > now) {
					try {
						const response = await axiosInstance.post('/token/refresh/', { refresh: refreshToken });
						localStorage.setItem('access_token', response.data.access);
						localStorage.setItem('refresh_token', response.data.refresh);

						axiosInstance.defaults.headers['Authorization'] = `Bearer ${response.data.access}`;
						originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;

						return axiosInstance(originalRequest);
					} catch (err) {
						console.error('Failed to refresh token', err);
						window.location.href = '/login/';
					}
				} else {
					console.log('Refresh token is expired', tokenParts.exp, now);
					window.location.href = '/login/';
				}
			} else {
				console.log('Refresh token not available.');
				window.location.href = '/login/';
			}
		}

		// specific error handling done elsewhere
		return Promise.reject(error);
	}
);

export default axiosInstance;