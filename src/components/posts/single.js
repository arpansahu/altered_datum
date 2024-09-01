import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axios';
import { useParams } from 'react-router-dom';
// MaterialUI
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Header from '../header';
import CardMedia from "@material-ui/core/CardMedia";

const useStyles = makeStyles((theme) => ({
	cardMedia: {
		paddingTop: '56.25%', // 16:9
		marginBottom: theme.spacing(4),
	},
	paper: {
		marginTop: theme.spacing(8),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	heroContent: {
		padding: theme.spacing(4, 0, 4),
	},
}));

export default function Post() {
	const { slug } = useParams();
	const classes = useStyles();

	const [data, setData] = useState({
		post: null,
		loading: true,
		error: null,
	});

	useEffect(() => {
		axiosInstance.get('post/' + slug)
			.then((res) => {
				setData({
					post: res.data,
					loading: false,
					error: null,
				});
			})
			.catch((err) => {
				setData({
					post: null,
					loading: false,
					error: err,
				});
				console.error('Error fetching post:', err);
			});
	}, [slug]);

	if (data.loading) {
		return <p>Loading post...</p>;
	}

	if (data.error) {
		return <p>Something went wrong. Please try again later.</p>;
	}

	if (!data.post) {
		return <p>Post not found.</p>;
	}

	return (
		<div className="App">
			<Header />
			<Container component="main" maxWidth="md">
				<CssBaseline />
				<div className={classes.paper}></div>
				<div className={classes.heroContent}>
					<Container maxWidth="sm">
						<CardMedia
							className={classes.cardMedia}
							image={data.post.image || 'https://source.unsplash.com/random'}
							title={data.post.title || 'Post image'}
							alt={data.post.title || 'Post image'}
						/>
						<Typography
							component="h1"
							variant="h2"
							align="center"
							color="textPrimary"
							gutterBottom
						>
							{data.post.title}
						</Typography>
						<Typography
							variant="h5"
							align="center"
							color="textSecondary"
							paragraph
						>
							{data.post.excerpt}
						</Typography>
						<Typography
							variant="body1"
							align="center"
							color="textSecondary"
							paragraph
						>
							{data.post.content}
						</Typography>
					</Container>
				</div>
			</Container>
		</div>
	);
}