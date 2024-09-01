import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import axiosInstance from './axios';
import Posts from './components/posts/posts';
import PostLoadingComponent from './components/posts/postLoading';
import Header from './components/header';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const history = useHistory();
  const PostLoading = PostLoadingComponent(Posts);
  const [appState, setAppState] = useState({
    loading: true,
    posts: null,
  });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axiosInstance.get();
        setAppState({ loading: false, posts: res.data });
      } catch (err) {
        console.log('Inside Error', err);
        if (err.response && err.response.status === 401) {
          history.push('/login');
        }
      }
    };

    fetchPosts();
  }, [history]);

  return (
    <div className="App">
      <ErrorBoundary>
        <Header />
      </ErrorBoundary>
      <h1>Latest Posts</h1>
      <PostLoading isLoading={appState.loading} posts={appState.posts} />
    </div>
  );
}

export default App;