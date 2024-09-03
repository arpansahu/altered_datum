import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axios/login';
import { useNavigate, Link } from 'react-router-dom';
// MaterialUI
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
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
	const classes = useStyles();
	const navigate = useNavigate(); // Use useNavigate instead of history

	const [formData, setFormData] = useState({
		email: '',
		password: '',
	});
	const [errorMessage, setErrorMessage] = useState('');

	useEffect(() => {
		if (localStorage.getItem('access_token')) {
			navigate('/'); // Use navigate instead of history.push
		}
	}, [navigate]);

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value.trim(),
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!formData.email || !formData.password) {
			setErrorMessage('Email and password are required');
			return;
		}

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

				axiosInstance.get('user/account/')
					.then((res) => {
						localStorage.setItem('account', JSON.stringify(res.data));
						navigate('/'); // Use navigate instead of history.push
						window.location.reload(); // Reload the DOM after navigation
					})
					.catch((err) => {
						console.error('Failed to fetch user account:', err);
					});
			})
			.catch((error) => {
				if (error.response && error.response.status === 401) {
					setErrorMessage('No active account found with the given credentials');
				} else {
					setErrorMessage('An error occurred. Please try again.');
				}
			});
	};

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
					{/* Uncomment and configure Facebook login if needed */}
					{/* <FbLogin
						appId="466557594456589"
						fields="name,email,picture"
						callback={responseFacebook}
					/> */}
					<form className={classes.form} noValidate onSubmit={handleSubmit}>
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
						{errorMessage && (
							<Typography variant="body2" color="error" align="center">
								{errorMessage}
							</Typography>
						)}
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
						>
							Sign In
						</Button>
						<Grid container>
							<Grid item xs>
								<Link to='/forget-password' variant="body2">
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
