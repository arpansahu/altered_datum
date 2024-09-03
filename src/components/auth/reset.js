import React, { useState } from 'react';
import axiosInstance from '../../axios';
import { useNavigate, useParams } from 'react-router-dom';
// MaterialUI
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
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
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
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
        opacity: 0.7,
    },
    error: {
        backgroundColor: theme.palette.error.dark,
    },
    success: {
        backgroundColor: theme.palette.success.main,
    },
}));

const PASSWORD_REGEX = "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,20})";

export default function ResetPassword() {
    const history = useNavigate();
    const { uidb64, token } = useParams();

    const initialFormData = {
        password: '',
        password_two: '',
    };

    const [formData, updateFormData] = useState(initialFormData);
    const [passwordsMatch, updatePasswordsMatch] = useState({ errorOpen: false, error: "" });
    const [message, updateMessage] = useState({ messageOpen: false, data: "" });
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

        if (formData.password === formData.password_two && PASSWORD_REGEX.test(formData.password)) {
            updatePasswordsMatch({ errorOpen: false, error: "" });
            axiosInstance
                .post(`user/account/resetpassword/`, {
                    uidb64: uidb64,
                    token: token,
                    password1: formData.password,
                    password2: formData.password_two,
                })
                .then(() => {
                    updateMessage({ messageOpen: true, data: "Password reset successfully" });
                    setTimeout(() => {
                        history.push('/login');
                    }, 3000);
                })
                .catch((error) => {
                    let errorMsg = "Something went wrong. Please try again.";
                    if (error.response) {
                        if (error.response.status === 400) {
                            errorMsg = "Reset link expired or already used";
                        } else if (error.response.status === 206) {
                            errorMsg = "Passwords do not match";
                        }
                    }
                    updatePasswordsMatch({ errorOpen: true, error: errorMsg });
                });
        } else if (formData.password !== formData.password_two) {
            updatePasswordsMatch({ errorOpen: true, error: "Both passwords should be the same" });
        }
    };

    const showPassword = () => {
        setHidePassword(!hidePassword);
    };

    const showPasswordTwo = () => {
        setHidePasswordTwo(!hidePasswordTwo);
    };

    const errorClose = () => {
        updatePasswordsMatch({ errorOpen: false, error: "" });
    };

    const messageClose = () => {
        updateMessage({ messageOpen: false, data: "" });
    };

    const classes = useStyles();

    return (
        <div className="App">
            <HeaderForGuest />
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <div className={classes.paper}>
                    <Typography component="h1" variant="h5">
                        Reset Password
                    </Typography>
                    <ValidatorForm className={classes.form} noValidate onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
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
                                                        onClick={showPassword}
                                                    />
                                                ) : (
                                                    <VisibilityTwoToneIcon
                                                        fontSize="default"
                                                        className={classes.passwordEye}
                                                        onClick={showPassword}
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
                                        'The password must be strong with 8-20 characters, including upper and lower case letters, a number, and a special character.',
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
                                                        onClick={showPasswordTwo}
                                                    />
                                                ) : (
                                                    <VisibilityTwoToneIcon
                                                        fontSize="default"
                                                        className={classes.passwordEye}
                                                        onClick={showPasswordTwo}
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
                                        'The password must be strong with 8-20 characters, including upper and lower case letters, a number, and a special character.',
                                    ]}
                                />
                            </Grid>
                            {passwordsMatch.error && (
                                <Snackbar
                                    variant="error"
                                    key={passwordsMatch.error}
                                    anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: "center",
                                    }}
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
                            {message.data && (
                                <Snackbar
                                    variant="success"
                                    severity="success"
                                    key={message.data}
                                    anchorOrigin={{
                                        vertical: "bottom",
                                        horizontal: "center",
                                    }}
                                    open={message.messageOpen}
                                    onClose={messageClose}
                                    autoHideDuration={3000}
                                >
                                    <SnackbarContent
                                        className={classes.success}
                                        message={
                                            <div style={{ color: "green" }}>
                                                <CheckCircleOutlineIcon fontSize="large" />
                                                <span style={{ marginLeft: "8px" }}>{message.data}</span>
                                            </div>
                                        }
                                        action={[
                                            <IconButton key="close" aria-label="close" onClick={messageClose}>
                                                <CloseIcon style={{ color: "green" }} />
                                            </IconButton>,
                                        ]}
                                    />
                                </Snackbar>
                            )}
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                        >
                            Reset Password
                        </Button>
                    </ValidatorForm>
                </div>
            </Container>
        </div>
    );
}