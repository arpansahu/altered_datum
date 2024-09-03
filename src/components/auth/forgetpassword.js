import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axios';
import { useNavigate } from 'react-router-dom';
// MaterialUI
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import HeaderForGuest from '../headerforguest';
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import IconButton from "@material-ui/core/IconButton";
import ErrorIcon from "@material-ui/icons/Error";
import CloseIcon from "@material-ui/icons/Close";
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
	error: {
		backgroundColor: theme.palette.error.dark,
	},
	success: {
		backgroundColor: theme.palette.success.main,
	},
}));

export default function SignIn() {
	const classes = useStyles();
	const history = useNavigate();

	useEffect(() => {
		if (localStorage.getItem('access_token')) {
			history.push('/');
		}
	}, [history]);

	const [formData, setFormData] = useState({
		email: '',
	});

	const [notification, setNotification] = useState({
		open: false,
		message: '',
		variant: '',
	});

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value.trim(),
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!formData.email) {
			setNotification({
				open: true,
				message: "Email is required",
				variant: "error",
			});
			return;
		}

		axiosInstance
			.post(`user/account/forgetpassword/`, { email: formData.email })
			.then((res) => {
				setNotification({
					open: true,
					message: "Password reset link sent successfully",
					variant: "success",
				});
			})
			.catch((error) => {
				if (error.response && error.response.status === 404) {
					setNotification({
						open: true,
						message: "Account with this email not found",
						variant: "error",
					});
				} else {
					setNotification({
						open: true,
						message: "An error occurred. Please try again.",
						variant: "error",
					});
				}
			});
	};

	const handleClose = () => {
		setNotification({ ...notification, open: false });
	};

	return (
		<div className="App">
			<HeaderForGuest />
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<div className={classes.paper}>
					<Typography component="h1" variant="h5">
						Forget Password?
					</Typography>
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
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
						>
							Reset Password
						</Button>
					</form>
					<Snackbar
						open={notification.open}
						autoHideDuration={3000}
						onClose={handleClose}
						anchorOrigin={{
							vertical: "bottom",
							horizontal: "center",
						}}
					>
						<SnackbarContent
							className={classes[notification.variant]}
							message={
								<div>
									{notification.variant === "error" ? (
										<ErrorIcon fontSize="large" />
									) : (
										<CheckCircleOutlineIcon fontSize="large" />
									)}
									<span style={{ marginLeft: "8px" }}>{notification.message}</span>
								</div>
							}
							action={[
								<IconButton key="close" aria-label="close" onClick={handleClose}>
									<CloseIcon />
								</IconButton>,
							]}
						/>
					</Snackbar>
				</div>
			</Container>
		</div>
	);
}