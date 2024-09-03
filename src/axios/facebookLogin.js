import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const client_id = process.env.REACT_APP_OAUTH_CLIENT_ID;
const client_secret = process.env.REACT_APP_OAUTH_CLIENT_SECRET;

const facebookLogin = (accesstoken) => {
	// console.log(accesstoken);
	axios
		.post('https://altered-datum-api.arpansahu.me/auth/convert-token', {
			token: accesstoken,
			backend: 'facebook',
			grant_type: 'convert_token',
			client_id: client_id,
			client_secret: client_secret,
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
