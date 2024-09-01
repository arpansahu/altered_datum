import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axios';
import Header from '../header';
// MaterialUI
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import IconButton from "@material-ui/core/IconButton";
import ErrorIcon from "@material-ui/icons/Error";
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';
import CloseIcon from "@material-ui/icons/Close";
import { NavLink } from 'react-router-dom';

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
	error: {
		backgroundColor: theme.palette.error.dark,
	},
	success: {
		backgroundColor: theme.palette.success.main,
	},
}));

export default function FormPropsTextFields() {
	const classes = useStyles();
	const [id, setId] = useState(null);
	const [formData, setFormData] = useState({
		username: '',
		about: '',
	});
	const [user, setUser] = useState({});
	const [snackbar, setSnackbar] = useState({
		open: false,
		message: '',
		variant: '',
	});

	useEffect(() => {
		axiosInstance.get('user/account/')
			.then((res) => {
				const account = res.data;
				setUser({
					is_superuser: account.is_staff,
					username: account.username,
					email: account.email,
				});
				setFormData({
					username: account.username,
					about: account.about || '',
				});
				setId(account.id);
			})
			.catch(err => {
				console.error("Error fetching user data:", err);
			});
	}, []);

	const handleChange = (e) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!formData.username && !formData.about) {
			setSnackbar({
				open: true,
				message: "Nothing to update",
				variant: 'error',
			});
			return;
		}

		axiosInstance.patch(`user/account/update/${id}/`, formData)
			.then((res) => {
				setSnackbar({
					open: true,
					message: "Your account details were updated successfully",
					variant: 'success',
				});
			})
			.catch((error) => {
				setSnackbar({
					open: true,
					message: "Failed to update account details",
					variant: 'error',
				});
				console.error("Error updating account details:", error);
			});
	};

	const handleSnackbarClose = () => {
		setSnackbar({
			...snackbar,
			open: false,
		});
	};

	return (
		<div className="App">
			<Header />
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<div className={classes.paper}>
					<Typography component="h1" variant="h5">
						Account Details
					</Typography>

					<form className={classes.form} noValidate onSubmit={handleSubmit}>
						<TextField
							variant="outlined"
							margin="normal"
							fullWidth
							id="email"
							name="email"
							autoComplete="email"
							disabled
							value={user.email}
						/>
						<TextField
							variant="outlined"
							margin="normal"
							fullWidth
							id="username"
							name="username"
							placeholder="Username"
							onChange={handleChange}
							value={formData.username}
						/>
						<TextField
							variant="outlined"
							margin="normal"
							fullWidth
							multiline
							id="about"
							name="about"
							label="About"
							placeholder="Tell us about yourself"
							onChange={handleChange}
							value={formData.about}
						/>

						<Button
							type="submit"
							fullWidth
							variant="contained"
							color="primary"
							className={classes.submit}
							aria-label="Update Account details"
						>
							Update Account details
						</Button>
						<Button
							fullWidth
							variant="contained"
							color="secondary"
							className={classes.submit}
							component={NavLink}
							to="/account/passwordupdate"
							aria-label="Update Password"
						>
							Update Password
						</Button>
					</form>

					<Snackbar
						open={snackbar.open}
						autoHideDuration={3000}
						onClose={handleSnackbarClose}
						anchorOrigin={{
							vertical: "bottom",
							horizontal: "center"
						}}
					>
						<SnackbarContent
							className={classes[snackbar.variant]}
							message={
								<div>
									<span style={{ marginRight: "8px" }}>
										{snackbar.variant === 'error' ? (
											<ErrorIcon fontSize="large" />
										) : (
											<CheckCircleOutlineIcon fontSize="large" />
										)}
									</span>
									<span>{snackbar.message}</span>
								</div>
							}
							action={[
								<IconButton
									key="close"
									aria-label="close"
									onClick={handleSnackbarClose}
								>
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