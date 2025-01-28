import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import { Button, TextField, Typography } from '@mui/material';

import { useState } from 'react';

import { useForm } from 'react-hook-form'

import FormError from '../components/alerts/FormError';

import { Link, useNavigate } from 'react-router';

import { register as registerUser} from '../api/users.api.js'

import { setErrorAlert, setSuccessAlert } from '../features/alert/alertSlice.js';
import { useDispatch } from 'react-redux';
import BasicAlert from '../components/alerts/BasicAlert.jsx';

export default function Navbar() {

    const [pwdVisibility, setPwdVisibility] = useState(false);

    const { register, watch, handleSubmit, formState: { errors } } = useForm();

    const password = watch("password");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [signUpAlert, setSignUpAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [severity, setSeverity] = useState("success");

    const signUp = async (data) => {
        try {
            const response = await registerUser(data);

            if(response.statuscode === 201){
                setAlertMessage("Registered Successfully. Please login")
                setSignUpAlert(true)
                setSeverity("success");
                setTimeout(()=>{
                    navigate('/login');
                },1500)
            }
        } catch (error) {
            if(error?.status === 409){
                setAlertMessage("Username or email already in use")
                setSeverity("error");
                setSignUpAlert(true)
            }
        }
    }

    return (
        <>
            <Typography
                variant='h2'
                textAlign={'center'}
                sx={{ m: 2 }}
            >
                mingle
                <EmojiPeopleIcon sx={{ fontSize: "inherit", mb: -1 }} />
            </Typography>
            <Container
                 className='signContainer greyBorder'
            >
                <Typography variant='h5' sx={{ mb: 4, ml: 1 }}>
                    Sign up
                </Typography>
                <Box component="form" noValidate onSubmit={handleSubmit(signUp)} sx={{ flexGrow: 1 }}>
                    <Grid container spacing={{ xs: 2, md: 3 }}>
                        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                            <TextField
                                label='First Name'
                                type='text'
                                error={errors.firstName && true}
                                fullWidth
                                {...register("firstName", {
                                    required: true
                                })}
                            />
                            {errors.firstName && errors.firstName.type === 'required' && (
                                <FormError message="First name is required" />
                            )}
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                            <TextField
                                label='Last Name'
                                type='text'
                                error={errors.lastName && true}
                                fullWidth
                                {...register("lastName", {
                                    required: true
                                })}
                            />
                            {errors.lastName && errors.lastName.type === 'required' && (
                                <FormError message="Last name is required" />
                            )}
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                            <TextField
                                label='Email'
                                type='email'
                                error={errors.email && true}
                                fullWidth
                                {...register("email", {
                                    required: true,
                                    maxLength: 254,
                                    pattern: /^\S+@\S+$/i
                                })}
                            />
                            {errors.email && errors.email.type === 'required' && (
                                <FormError message="Email is required" />
                            )}
                            {errors.email && errors.email.type === 'pattern' && (
                                <FormError message="Invalid email Id" />
                            )}
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                            <TextField
                                label='Username'
                                type='text'
                                error={errors.username && true}
                                fullWidth
                                {...register("username", {
                                    required: true,
                                    maxLength: 30,
                                })}
                            />
                            {errors.username && errors.username.type === 'required' && (
                                <FormError message="Username is required" />
                            )}
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                            <TextField
                                label='Password'
                                type={pwdVisibility ? "text" : "password"}
                                error={errors.password && true}
                                fullWidth
                                {...register("password", {
                                    required: true,
                                    minLength: 8
                                })}
                                slotProps={{
                                    input: {
                                        endAdornment: <InputAdornment position="end">
                                            <IconButton onClick={() => setPwdVisibility(!pwdVisibility)}>
                                                {pwdVisibility ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>,
                                    },
                                }}
                            />
                            {errors.password && errors.password.type === 'required' && (
                                <FormError message="Password is required" />
                            )}
                            {errors.password && errors.password.type === 'minLength' && (
                                <FormError message="Password is too short" />
                            )}
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                            <TextField
                                label='Confirm password'
                                type={pwdVisibility ? "text" : "password"}
                                error={errors.confirmPassword && true}
                                fullWidth
                                {...register("confirmPassword", {
                                    required: true,
                                    validate: value => value === password || "Passwords do not match"
                                })}
                                slotProps={{
                                    input: {
                                        endAdornment: <InputAdornment position="end">
                                            <IconButton onClick={() => setPwdVisibility(!pwdVisibility)}>
                                                {pwdVisibility ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>,
                                    },
                                }}
                            />
                            {errors.confirmPassword && errors.confirmPassword.type === 'required' && (
                                <FormError message="Confirm password is required" />
                            )}
                            {errors.confirmPassword && (
                                <FormError message={errors.confirmPassword.message}/>
                            )}
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                            <Button
                                fullWidth
                                size='large'
                                variant='contained'
                                type='submit'
                            >
                                Create Account
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
            <Typography  sx={{ textAlign: "center", mt: 2, mb: 4 }}>
                Already have an account? 
                <Link to={"/login"} className='redirect'> Sign in to your account</Link> 
            </Typography>
            <BasicAlert open={signUpAlert} message={alertMessage} severity={severity} setOpen={setSignUpAlert}/>
        </>
    )
}