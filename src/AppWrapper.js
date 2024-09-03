import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

function ProtectedRoute({ element, ...rest }) {
    const token_var = localStorage.getItem('access_token');
    return token_var ? element : <Navigate to="/login" />;
}

function AppWrapper() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<ProtectedRoute element={<App />} />} />
                <Route path="/admin" element={<ProtectedRoute element={<Admin />} />} />
                <Route path="/admin/create" element={<ProtectedRoute element={<Create />} />} />
                <Route path="/admin/edit/:id" element={<ProtectedRoute element={<Edit />} />} />
                <Route path="/admin/delete/:id" element={<ProtectedRoute element={<Delete />} />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/logout" element={<ProtectedRoute element={<Logout />} />} />
                <Route path="/post/:slug" element={<ProtectedRoute element={<Single />} />} />
                <Route path="/search" element={<ProtectedRoute element={<Search />} />} />
                <Route path="/testing" element={<ProtectedRoute element={<Testing />} />} />
                <Route path="/account" element={<ProtectedRoute element={<Account />} />} />
                <Route path="/account/passwordupdate" element={<ProtectedRoute element={<PasswordReset />} />} />
                <Route path="/activate/:uidb64/:token" element={<Activate />} />
                <Route path="/unverified" element={<ProtectedRoute element={<NotActivated />} />} />
                <Route path="/forget-password" element={<ForgetPassword />} />
                <Route path="/reset/:uidb64/:token" element={<Reset />} />
            </Routes>
            <Footer />
        </Router>
    );
}

export default AppWrapper;
