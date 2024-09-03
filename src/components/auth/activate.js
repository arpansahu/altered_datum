import HeaderForGuest from '../headerforguest';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// MaterialUI
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import axiosInstance from '../../axios';

const useStyles = makeStyles((theme) => ({
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	h4: {
		color: 'green',
		'&.error': {
			color: 'red',
		},
	},
}));

export default function ActivateAccount() {
	const classes = useStyles();
	const { uidb64, token } = useParams();
	const [message, setMessage] = useState('');
	const [error, setError] = useState(false);
	const history = useNavigate();

	useEffect(() => {
		let isMounted = true; // To avoid state update if the component is unmounted

		axiosInstance
			.post(`user/account/activate/`, {
				uidb64: uidb64,
				token: token,
			})
			.then((res) => {
				if (isMounted) {
					setMessage(res.data);
					setError(false);
					setTimeout(() => {
						history.push('/logout');
					}, 5000);
				}
			})
			.catch((err) => {
				if (isMounted) {
					console.error('Error during activation:', err);
					setMessage('Activation failed. Please try again or contact support.');
					setError(true);
				}
			});

		return () => {
			isMounted = false; // Cleanup to prevent setting state after unmount
		};
	}, [uidb64, token, history]);

	return (
		<div className="App">
			<HeaderForGuest />
			<Container component="main" maxWidth="xs">
				<CssBaseline />
				<div className={classes.paper} style={{ whiteSpace: 'pre-line' }}>
					<h4 className={`${classes.h4} ${error ? 'error' : ''}`} aria-live="polite">
						{message}
					</h4>
				</div>
			</Container>
		</div>
	);
}