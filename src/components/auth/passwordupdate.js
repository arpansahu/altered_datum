import Header from '../header';
import React, { useState, useEffect } from 'react';
// MaterialUI
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import axiosInstance from '../../axios';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import InputAdornment from '@material-ui/core/InputAdornment';
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import IconButton from "@material-ui/core/IconButton";
import ErrorIcon from "@material-ui/icons/Error";
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CloseIcon from "@material-ui/icons/Close";
import VisibilityOffTwoToneIcon from "@material-ui/icons/VisibilityOffTwoTone";
import VisibilityTwoToneIcon from "@material-ui/icons/VisibilityTwoTone";
import Typography from '@material-ui/core/Typography';

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

const PASSWORD_REGEX = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,20})";

export default function UpdatePassword() {
	const classes = useStyles();
	const [formData, updateFormData] = useState({ password: '', password_two: '' });
	const [userId, setUserId] = useState(null);
	const [snackbar, setSnackbar] = useState({ open: false, message: '', variant: '' });

	useEffect(() => {
		axiosInstance.get('user/account/')
			.then((res) => {
				setUserId(res.data.id);
			})
			.catch((err) => {
				setSnackbar({ open: true, message: "Failed to fetch user data", variant: "error" });
			});
	}, []);

	const handleChange = (e) => {
		updateFormData({
			...formData,
			[e.target.name]: e.target.value.trim(),
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (formData.password !== formData.password_two) {
			setSnackbar({ open: true, message: "Both passwords should be the same", variant: "error" });
			return;
		}

		axiosInstance.patch(`user/account/passwordchange/${userId}/`, {
			password: formData.password,
			password2: formData.password_two
		})
			.then(() => {
				setSnackbar({ open: true, message: "Your password has been updated successfully", variant: "success" });
			})
			.catch((error) => {
				let errorMsg = "An error occurred. Please try again.";
				if (error.response) {
					if (error.response.status === 403) {
						errorMsg = "User already registered";
					} else if (error.response.status === 400) {
						errorMsg = "Your input details are incorrect";
					}
				}
				setSnackbar({ open: true, message: errorMsg, variant: "error" });
			});
	};

	const handleSnackbarClose = () => {
		setSnackbar({ ...snackbar, open: false });
	};

	const [hidePassword, setHidePassword] = useState(true);
	const [hidePassword_two, setHidePassword_Two] = useState(true);

	return (
		<div className="App">
			<Header />
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<div className={classes.paper}>
					<Typography component="h1" variant="h5">
						Update Password
					</Typography>
					<ValidatorForm className={classes.form} noValidate onSubmit={handleSubmit}>
						<TextValidator
							type={hidePassword ? "password" : "input"}
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										{hidePassword ? (
											<VisibilityOffTwoToneIcon fontSize="default" onClick={() => setHidePassword(!hidePassword)} />
										) : (
											<VisibilityTwoToneIcon fontSize="default" onClick={() => setHidePassword(!hidePassword)} />
										)}
									</InputAdornment>
								),
							}}
							variant="outlined"
							required
							fullWidth
							margin="normal"
							name="password"
							label="Password"
							id="password"
							onChange={handleChange}
							value={formData.password}
							validators={['required', `matchRegexp:${PASSWORD_REGEX}`]}
							errorMessages={['This field is required', 'Password must be strong']}
						/>
						<TextValidator
							type={hidePassword_two ? "password" : "input"}
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										{hidePassword_two ? (
											<VisibilityOffTwoToneIcon fontSize="default" onClick={() => setHidePassword_Two(!hidePassword_two)} />
										) : (
											<VisibilityTwoToneIcon fontSize="default" onClick={() => setHidePassword_Two(!hidePassword_two)} />
										)}
									</InputAdornment>
								),
							}}
							variant="outlined"
							required
							fullWidth
							margin="normal"
							name="password_two"
							label="Confirm Password"
							id="password_two"
							onChange={handleChange}
							value={formData.password_two}
							validators={['required', `matchRegexp:${PASSWORD_REGEX}`]}
							errorMessages={['This field is required', 'Password must be strong']}
						/>
						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
						>
							Update Password
						</Button>
					</ValidatorForm>
					<Snackbar
						open={snackbar.open}
						autoHideDuration={3000}
						onClose={handleSnackbarClose}
						anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
					>
						<SnackbarContent
							className={classes[snackbar.variant]}
							message={
								<div>
									{snackbar.variant === "error" ? (
										<ErrorIcon fontSize="large" />
									) : (
										<CheckCircleOutlineIcon fontSize="large" />
									)}
									<span style={{ marginLeft: "8px" }}>{snackbar.message}</span>
								</div>
							}
							action={[
								<IconButton key="close" aria-label="close" onClick={handleSnackbarClose}>
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