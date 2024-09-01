import HeaderForGuest from '../headerforguest';
import React from 'react';

// MaterialUI
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import MailIcon from '@material-ui/icons/Mail';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		whiteSpace: 'pre-line', // Moved from inline style to class
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
	h4: {
		color: 'red',
	},
}));

export default function AccountNotActivated() {
	const classes = useStyles();

	return (
		<div className="App">
			<HeaderForGuest />
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<div className={classes.paper}>
					<h4 className={classes.h4}>Your account is not activated</h4>
					<Button
						href="https://mail.google.com/mail/u/0/#inbox/"
						color="primary"
						variant="contained"
						fullWidth
						className={classes.submit}
						target="_blank"
						rel="noopener noreferrer" // Security improvement for external links
						aria-label="Check your email"
					>
						<MailIcon /> Check your mail
					</Button>
				</div>
			</Container>
		</div>
	);
}