import React, { useEffect, useState } from 'react';
import './App.css';
import Posts from './components/admin/posts';
import PostLoadingComponent from './components/posts/postLoading';
import axiosInstance from './axios';
import { useNavigate } from 'react-router-dom';

function Admin() {
	const history = useNavigate();
	const PostLoading = PostLoadingComponent(Posts);
	const [appState, setAppState] = useState({
		loading: true,
		posts: null,
	});

	useEffect(() => {
		const fetchPosts = async () => {
			try {
				const accessToken = localStorage.getItem('access_token');
				const res = await axiosInstance.get('', {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				});
				setAppState({ loading: false, posts: res.data });
			} catch (err) {
				console.error("Error fetching posts:", err);
				history.push('/login');
			}
		};

		fetchPosts();
	}, [history]);

	return (
		<div className="App">
			<PostLoading isLoading={appState.loading} posts={appState.posts} />
		</div>
	);
}

export default Admin;