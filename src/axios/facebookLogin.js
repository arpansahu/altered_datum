import axios from 'axios';
import { useHistory } from 'react-router-dom';

const facebookLogin = (accesstoken) => {
	// console.log(accesstoken);
	axios
		.post('https://altered-datum-api.arpansahu.me/auth/convert-token', {
			token: accesstoken,
			backend: 'facebook',
			grant_type: 'convert_token',
			client_id: 'w1m7AgQGkLKeb1eowfIY4ym3ofdSw5yLYWWBmEKv',
			client_secret:
				'YH5XsflhUkt9qetBYZL0gbsYN17EC0n5b0Lam4GIZ94ZIIaHbwT2psYd3ebbOzrF13xb6Fiuh73EK7uACIsQhNXwnvQDvpOT8QYuaNO0Jt8vLa1L0CxVLAa3Z1ySwSD8',
		})
		.then((res) => {
			// console.log("access_token: "+res.data.access_token)
			// console.log("refresh_token: "+res.data.refresh_token)
			localStorage.setItem('access_token', res.data.access_token);
			localStorage.setItem('refresh_token', res.data.refresh_token);
			window.location.reload();
		});
};

export default facebookLogin;
