import React, { useState, useEffect } from 'react';
import { Route, BrowserRouter as Router, Switch, Redirect, useHistory } from 'react-router-dom';
import App from './App';
import Footer from './components/footer';
import Register from './components/auth/register';
import Login from './components/auth/login';
import Logout from './components/auth/logout';
import Single from './components/posts/single';
import Search from './components/posts/search';
import Admin from './Admin';
import Create from './components/admin/create';
import Edit from './components/admin/edit';
import Delete from './components/admin/delete';
import Testing from './components/testing';
import Account from './components/auth/account';
import PasswordReset from './components/auth/passwordupdate';
import Activate from './components/auth/activate';
import NotActivated from './components/auth/notactivated';
import ForgetPassword from './components/auth/forgetpassword';
import Reset from './components/auth/reset';

function AppWrapper() {
    const history = useHistory();
    const [token_var, setToken_var] = useState(localStorage.getItem('access_token'));

    useEffect(() => {
        setToken_var(localStorage.getItem('access_token'));
    }, []); // Runs only once when the component mounts

    const ProtectedRoute = ({ component: Component, ...rest }) => (
        <Route 
            {...rest} 
            render={(props) => 
                token_var ? (
                    <Component {...props} />
                ) : (
                    <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
                )
            } 
        />
    );

    return (
        <Router>
            <React.StrictMode>
                <Switch>
                    <ProtectedRoute exact path="/" component={App} />
                    <ProtectedRoute exact path="/admin" component={Admin} />
                    <ProtectedRoute exact path="/admin/create" component={Create} />
                    <ProtectedRoute exact path="/admin/edit/:id" component={Edit} />
                    <ProtectedRoute exact path="/admin/delete/:id" component={Delete} />
                    <Route path="/register" component={Register} />
                    <Route path="/login" component={Login} />
                    <ProtectedRoute path="/logout" component={Logout} />
                    <ProtectedRoute path="/post/:slug" component={Single} />
                    <ProtectedRoute path="/search" component={Search} />
                    <ProtectedRoute path="/testing" component={Testing} />
                    <ProtectedRoute exact path="/account" component={Account} />
                    <ProtectedRoute exact path="/account/passwordupdate" component={PasswordReset} />
                    <Route exact path="/activate/:uidb64/:token" component={Activate} />
                    <ProtectedRoute exact path="/unverified" component={NotActivated} />
                    <Route exact path="/forget-password" component={ForgetPassword} />
                    <Route exact path="/reset/:uidb64/:token" component={Reset} />
                </Switch>
                <Footer />
            </React.StrictMode>
        </Router>
    );
}

export default AppWrapper;