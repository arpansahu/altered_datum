import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axios';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';

const useStyles = makeStyles((theme) => ({
	cardMedia: {
		paddingTop: '56.25%', // 16:9
	},
	link: {
		margin: theme.spacing(1, 1.5),
		textDecoration: 'none',
	},
	cardHeader: {
		backgroundColor:
			theme.palette.type === 'light'
				? theme.palette.grey[200]
				: theme.palette.grey[700],
	},
	postTitle: {
		fontSize: '16px',
		textAlign: 'left',
	},
	postText: {
		display: 'flex',
		justifyContent: 'left',
		alignItems: 'baseline',
		fontSize: '12px',
		textAlign: 'left',
		marginBottom: theme.spacing(2),
	},
	card: {
		padding: theme.spacing(2),
	},
}));

const Search = () => {
	const classes = useStyles();
	const [appState, setAppState] = useState({
		posts: [],
		loading: true,
		error: null,
	});

	useEffect(() => {
		axiosInstance
			.get('search/' + window.location.search)
			.then((res) => {
				const allPosts = res.data;
				setAppState({ posts: allPosts, loading: false });
			})
			.catch((err) => {
				setAppState({ posts: [], loading: false, error: err });
				console.error('Error fetching posts:', err);
			});
	}, []);

	if (appState.loading) {
		return <p>Loading posts...</p>;
	}

	if (appState.error) {
		return <p>Something went wrong. Please try again later.</p>;
	}

	if (appState.posts.length === 0) {
		return <p>No posts found for your search query.</p>;
	}

	return (
		<Container maxWidth="md" component="main">
			<Grid container spacing={5} alignItems="flex-end">
				{appState.posts.map((post) => (
					<Grid item key={post.id} xs={12} md={4}>
						<Card className={classes.card}>
							<Link
								color="textPrimary"
								href={`/post/${post.slug}`}
								className={classes.link}
							>
								<CardMedia
									className={classes.cardMedia}
									image={post.image || 'https://source.unsplash.com/random'}
									title={post.title}
								/>
							</Link>
							<CardContent className={classes.cardContent}>
								<Typography
									gutterBottom
									variant="h6"
									component="h2"
									className={classes.postTitle}
								>
									{post.title.length > 50 ? `${post.title.substr(0, 50)}...` : post.title}
								</Typography>
								<div className={classes.postText}>
									<Typography color="textSecondary">
										{post.excerpt.length > 40
											? `${post.excerpt.substr(0, 40)}...`
											: post.excerpt}
									</Typography>
								</div>
							</CardContent>
						</Card>
					</Grid>
				))}
			</Grid>
		</Container>
	);
};

export default Search;