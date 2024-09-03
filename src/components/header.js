import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, CssBaseline, Link, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { NavLink, useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import SearchBar from 'material-ui-search-bar';
import axiosInstance from '../axios';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import logo from '../logo.png';

const useStyles = makeStyles((theme) => ({
    appBar: {
        color: 'white',
    },
    link: {
        margin: theme.spacing(1, 1.5),
    },
    toolbarTitle: {
        flexGrow: 1,
    },
    toolbar: {
        minHeight: '100px',
    },
    logo: {
        maxWidth: 80,
        maxHeight: 80,
        borderRadius: 10,
        flexGrow: 1,
    },
    back: {
        alignSelf: 'center',
        color: "primary",
        marginBlockStart: 0,
        marginBlockEnd: 0,
    },
}));

function Header() {
    const classes = useStyles();
    const history = useNavigate();
    const location = useLocation(); // Use useLocation to get the current path

    const [appState, setAppState] = useState({
        token: localStorage.getItem('access_token'),
        user_data: {
            is_superuser: false,
            username: null,
            email: null,
            id: null,
            is_active: false,
            is_email_verified: false,
        },
    });

    const [data, setData] = useState({ search: '' });
    const path = location.pathname; // Get the current path from useLocation

    useEffect(() => {
        if (appState.token) {
            axiosInstance.get('user/account/')
                .then((res) => {
                    const account = res.data;
                    setAppState((prevState) => ({
                        ...prevState,
                        user_data: {
                            is_superuser: account.is_staff,
                            username: account.username,
                            email: account.email,
                            id: account.id,
                            is_active: account.is_active,
                            is_email_verified: account.is_email_verified,
                        },
                    }));

                    if (!account.is_email_verified) {
                        history.push('/unverified');
                    }
                })
                .catch((err) => {
                    console.error("Error fetching account data:", err);
                });
        }
    }, [path, appState.token]);

    const goSearch = () => {
        history.push({
            pathname: '/search/',
            search: '?search=' + data.search,
        });
        window.location.reload();
    };

    const goBack = () => {
        history(-1);
    };

    return (
        <React.Fragment>
            <CssBaseline />
            <AppBar
                position="static"
                color="default"
                elevation={0}
                className={classes.appBar}
            >
                <Toolbar className={classes.toolbar}>
                    <Link component={NavLink} to="/">
                        <img src={logo} alt="Altered Datum Logo" className={classes.logo} />
                    </Link>

                    <Typography variant="h6" color="inherit" noWrap className={classes.toolbarTitle}></Typography>

                    <Button
                        startIcon={<ArrowBackIcon />}
                        color="primary"
                        variant="outlined"
                        className={classes.back}
                        onClick={goBack}
                    >
                        Back
                    </Button>

                    {appState.token && (
                        <SearchBar
                            value={data.search}
                            onChange={(newValue) => setData({ search: newValue })}
                            onRequestSearch={goSearch}
                        />
                    )}

                    {appState.user_data.is_superuser && (
                        <Button
                            color="primary"
                            variant="outlined"
                            className={classes.link}
                            component={NavLink}
                            to="/admin"
                        >
                            Admin Panel
                        </Button>
                    )}

                    <Button
                        color="primary"
                        variant="outlined"
                        className={classes.link}
                        component={NavLink}
                        to="/account/"
                    >
                        My Account
                    </Button>
                    <Button
                        color="primary"
                        variant="outlined"
                        className={classes.link}
                        component={NavLink}
                        to="/logout"
                    >
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>
        </React.Fragment>
    );
}

export default Header;