import React, { useState } from 'react';
import axiosInstance from '../../axios';
import { useNavigate } from 'react-router-dom';
// MaterialUI
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import HeaderForGuest from '../headerforguest';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import VisibilityOffTwoToneIcon from "@material-ui/icons/VisibilityOffTwoTone";
import VisibilityTwoToneIcon from "@material-ui/icons/VisibilityTwoTone";
import InputAdornment from '@material-ui/core/InputAdornment';
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import IconButton from "@material-ui/core/IconButton";
import ErrorIcon from "@material-ui/icons/Error";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    passwordEye: {
        color: "rgba(131,153,167,0.9)",
        opacity: 0.7
    },
    error: {
        backgroundColor: theme.palette.error.dark,
    },
}));

const PASSWORD_REGEX = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,20})";

export default function SignUp() {
    const history = useNavigate();
    const classes = useStyles();

    const initialFormData = {
        email: '',
        username: '',
        password: '',
        password_two: '',
    };

    const [formData, updateFormData] = useState(initialFormData);
    const [passwordsMatch, updatePasswordsMatch] = useState({ errorOpen: false, error: "" });
    const [hidePassword, setHidePassword] = useState(true);
    const [hidePasswordTwo, setHidePasswordTwo] = useState(true);

    const handleChange = (e) => {
        updateFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (formData.password !== formData.password_two) {
            updatePasswordsMatch({ errorOpen: true, error: "Both passwords should be the same" });
            return;
        }

        axiosInstance.post(`user/create/`, {
            email: formData.email,
            username: formData.username,
            password: formData.password,
        })
            .then(() => {
                history.push('/login');
            })
            .catch((error) => {
                let errorMsg = "Your input details are incorrect";
                if (error.response) {
                    if (error.response.status === 403) {
                        errorMsg = "User already registered";
                    }
                }
                updatePasswordsMatch({ errorOpen: true, error: errorMsg });
            });
    };

    const togglePasswordVisibility = (toggleStateFunc) => {
        toggleStateFunc(prevState => !prevState);
    };

    const errorClose = () => {
        updatePasswordsMatch({ errorOpen: false, error: "" });
    };

    return (
        <div className="App">
            <HeaderForGuest />
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}></Avatar>
                    <Typography component="h1" variant="h5">
                        Sign up
                    </Typography>
                    <ValidatorForm className={classes.form} noValidate onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextValidator
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    onChange={handleChange}
                                    value={formData.email}
                                    validators={['required', 'isEmail']}
                                    errorMessages={['This field is required', 'Email is not valid']}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextValidator
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    name="username"
                                    value={formData.username}
                                    autoComplete="username"
                                    onChange={handleChange}
                                    validators={['required']}
                                    errorMessages={['This field is required']}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextValidator
                                    type={hidePassword ? "password" : "input"}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                {hidePassword ? (
                                                    <VisibilityOffTwoToneIcon
                                                        fontSize="default"
                                                        className={classes.passwordEye}
                                                        onClick={() => togglePasswordVisibility(setHidePassword)}
                                                    />
                                                ) : (
                                                    <VisibilityTwoToneIcon
                                                        fontSize="default"
                                                        className={classes.passwordEye}
                                                        onClick={() => togglePasswordVisibility(setHidePassword)}
                                                    />
                                                )}
                                            </InputAdornment>
                                        ),
                                    }}
                                    variant="outlined"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    id="password"
                                    autoComplete="current-password"
                                    onChange={handleChange}
                                    value={formData.password}
                                    validators={['required', `matchRegexp:${PASSWORD_REGEX}`]}
                                    errorMessages={[
                                        'This field is required',
                                        'The password must be strong with 8-20 characters, including upper and lower case letters, a number, and a special character.'
                                    ]}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextValidator
                                    type={hidePasswordTwo ? "password" : "input"}
                                    InputProps={{
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                {hidePasswordTwo ? (
                                                    <VisibilityOffTwoToneIcon
                                                        fontSize="default"
                                                        className={classes.passwordEye}
                                                        onClick={() => togglePasswordVisibility(setHidePasswordTwo)}
                                                    />
                                                ) : (
                                                    <VisibilityTwoToneIcon
                                                        fontSize="default"
                                                        className={classes.passwordEye}
                                                        onClick={() => togglePasswordVisibility(setHidePasswordTwo)}
                                                    />
                                                )}
                                            </InputAdornment>
                                        ),
                                    }}
                                    variant="outlined"
                                    required
                                    fullWidth
                                    name="password_two"
                                    label="Confirm Password"
                                    id="password_two"
                                    autoComplete="current-password"
                                    onChange={handleChange}
                                    value={formData.password_two}
                                    validators={['required', `matchRegexp:${PASSWORD_REGEX}`]}
                                    errorMessages={[
                                        'This field is required',
                                        'The password must be strong with 8-20 characters, including upper and lower case letters, a number, and a special character.'
                                    ]}
                                />
                            </Grid>
                            {passwordsMatch.error && (
                                <Snackbar
                                    variant="error"
                                    key={passwordsMatch.error}
                                    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                                    open={passwordsMatch.errorOpen}
                                    onClose={errorClose}
                                    autoHideDuration={3000}
                                >
                                    <SnackbarContent
                                        className={classes.error}
                                        message={
                                            <div>
                                                <ErrorIcon fontSize="large" color="error" />
                                                <span style={{ marginLeft: "8px" }}>{passwordsMatch.error}</span>
                                            </div>
                                        }
                                        action={[
                                            <IconButton key="close" aria-label="close" onClick={errorClose}>
                                                <CloseIcon color="inherit" />
                                            </IconButton>,
                                        ]}
                                    />
                                </Snackbar>
                            )}
                            <Grid item xs={12}>
                                <FormControlLabel
                                    control={<Checkbox value="allowExtraEmails" color="primary" />}
                                    label="I want to receive inspiration, marketing promotions and updates via email."
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Sign Up
                        </Button>
                        <Grid container justify="flex-end">
                            <Grid item>
                                <Link href="/login" variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </ValidatorForm>
                </div>
            </Container>
        </div>
    );
}