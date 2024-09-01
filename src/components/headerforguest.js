import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import { makeStyles } from '@material-ui/core/styles';
import { NavLink } from 'react-router-dom';
import Link from '@material-ui/core/Link';
import Button from '@material-ui/core/Button';
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
}));

function HeaderForGuest() {
    const classes = useStyles();

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
                    <Link
                        component={NavLink}
                        to="/"
                    >
                        <img src={logo} alt="Altered Datum Logo" className={classes.logo} />
                    </Link>

                    <Typography
                        variant="h6"
                        color="inherit"
                        noWrap
                        className={classes.toolbarTitle}
                    >
                        {/* Placeholder for title or other elements */}
                    </Typography>

                    <Button
                        color="primary"
                        variant="outlined"
                        className={classes.link}
                        component={NavLink}
                        to="/login"
                    >
                        Login
                    </Button>
                    <Button
                        color="primary"
                        variant="outlined"
                        className={classes.link}
                        component={NavLink}
                        to="/register"
                    >
                        Register
                    </Button>
                </Toolbar>
            </AppBar>
        </React.Fragment>
    );
}

export default HeaderForGuest;