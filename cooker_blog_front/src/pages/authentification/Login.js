import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axios';
import { useHistory } from 'react-router-dom';
//MaterialUI
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

const access_token = localStorage.getItem('access');
const refresh_token = localStorage.getItem('refresh');
const Id_User = localStorage.getItem('Id_User');

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
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

export default function SignIn() {
    const history = useHistory();
    const initialFormData = Object.freeze({
        email: '',
        password: '',
    });

    const [formData, updateFormData] = useState(initialFormData);

    const handleChange = (e) => {
        updateFormData({
            ...formData,
            [e.target.name]: e.target.value.trim(),
        });
    };

    useEffect(() => {
        axiosInstance.post(`auth/token/refresh/`, {
            refresh: refresh_token
        })
        .then((res) => {
            if(res.status === 200){
              localStorage.setItem('access', res.data.access);
              axiosInstance.defaults.headers['Authorization'] =
            'Bearer ' + access_token;
            }else{
               history.push('/login');
            }
               console.log(res);
        });
    }, [])

    const handleSubmit = (e) => {
        e.preventDefault();
        // console.log(formData);

        axiosInstance.post(`auth/login/`, {
                email: formData.email,
                password: formData.password,
            })
            .then((res) => {
                localStorage.setItem('access', res.data.data.tokens.access);
                localStorage.setItem('refresh', res.data.data.tokens.refresh);
                localStorage.setItem('Id_User', res.data.data.id);
                localStorage.setItem('is_staff', res.data.data.is_staff);
                axiosInstance.defaults.headers['Authorization'] =
                    'Bearer ' + access_token;
                // console.log(res.data.data);
                // history.push('/');
                window.location.href= '/';
            })
            .catch(error => {
                alert("Email ou mot de passe incorrect")
            });
    };

    const classes = useStyles();

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}></Avatar>
                <Typography component="h1" variant="h5">
                    Connexion
				</Typography>
                <form className={classes.form} noValidate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        onChange={handleChange}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Mot de passe"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        onChange={handleChange}
                    />
                    <FormControlLabel
                        control={<Checkbox value="remember" color="primary" />}
                        label="Se souvenir de moi"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className="login-submit"
                        onClick={handleSubmit}
                    >
                        Connexion
					</Button>
                    <Grid container justify="flex-end">
                        {/* <Grid item xs>
                            <Link href="/forgotpassword" variant="body2">
                                Forgot password?
							</Link>
                        </Grid> */}
                        <Grid item>
                            <Link href="/register" variant="body2">
                                {"Pas encore membre ? Inscription"}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    );
}