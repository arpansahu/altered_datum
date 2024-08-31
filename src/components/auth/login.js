import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axios/login';
import FbLogin from 'react-facebook-login';
// import FacebookLogin from '../../axios/facebookLogin';
import { useHistory, Link } from 'react-router-dom';
//MaterialUI
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
// import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import HeaderForGuest from '../headerforguest';

const client_id = process.env.REACT_APP_OAUTH_CLIENT_ID;
const client_secret = process.env.REACT_APP_OAUTH_CLIENT_SECRET;


const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}));

export default function SignIn() {
	const history = useHistory();
	
	if (localStorage.getItem('access_token')){
		
		window.location.reload();
		history.push('/');
	}
	
	const initialFormData = Object.freeze({
		email: '',
		password: '',
	});

	const [formData, updateFormData] = useState(initialFormData);

	const handleChange = async (e) => {
		updateFormData({
			...formData,
			[e.target.name]: e.target.value.trim(),
		});
	};

	// const [appState, setAppState] = useState(false);


	const handleSubmit = (e) => {
		e.preventDefault();
		// console.log(formData);

		
	axiosInstance
		.post(`auth/token/`, {
			grant_type: 'password',
			username: formData.email,
			password: formData.password,
			client_id: client_id,
			client_secret: client_secret,
		})
		.then((res) => {
			localStorage.setItem('access_token', res.data.access_token);
			localStorage.setItem('refresh_token', res.data.refresh_token);
			console.log(res.data.access_token)
			console.log(res.data.refresh_token)
			axiosInstance.get('user/account/')
				.then((res) => {
					// console.log(account)
					localStorage.setItem('account', res.data);
				})
			if (res.data.access){
				window.location.reload();
			}
			history.push('/');

		})
		.catch(function (error) {
			if (error.response) {
			//   console.log(error.response.data);
			//   console.log(error.response.status);
			//   console.log(error.response.headers);

				if (error.response.status == 401){
				document.getElementById("invalid user").innerHTML = 'No active account found with the given credentials';
				}
			}
		} );
	};

	// const responseFacebook = async (response) => {
	// 	// console.log(response);
	// 	FacebookLogin(response.accessToken);
	// };
	
	const classes = useStyles();

	return (
		<div className="App">
			<HeaderForGuest />
		<Container component="main" maxWidth="xs">
			<CssBaseline />
			<div className={classes.paper}>
				<Avatar className={classes.avatar}></Avatar>
				<Typography component="h1" variant="h5">
					Sign in
				</Typography>
				{/* <FbLogin
						appId="466557594456589"
						fields="name,email,picture"
						callback={responseFacebook}
				/> */}
				<form className={classes.form} noValidate>
					<TextField
						variant="outlined"
						margin="normal"
						required
						fullWidth
						id="email"
						label="Email Address"
						name="email"
						autoComplete="email"
						autoFocus
						onChange={handleChange}
						
					/>
					<TextField
						variant="outlined"
						margin="normal"
						required
						fullWidth
						name="password"
						label="Password"
						type="password"
						id="password"
						autoComplete="current-password"
						onChange={handleChange}
					/>
					<FormControlLabel
						control={<Checkbox value="remember" color="primary" />}
						label="Remember me"
					/>
					<h4 id="invalid user" style={{color:'red'}}></h4>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						color="primary"
						className={classes.submit}
						onClick={handleSubmit}
					>
						Sign In
					</Button>
					<Grid container>
						<Grid item xs>
							<Link href="#" variant="body2" to='/forget-password'>
								Forgot password?
							</Link>
						</Grid>
						<Grid item>
							<Link to="/register" variant="body2">
								{"Don't have an account? Sign Up"}
							</Link>
						</Grid>
					</Grid>
				</form>
			</div>
		</Container>
		</div>
	);
}
