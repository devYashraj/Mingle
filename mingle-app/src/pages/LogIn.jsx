import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import { Button, TextField, Typography } from '@mui/material';
import GoogleIcon from '../utils/GoogleIcon'

import { useState } from 'react';

import { useForm } from 'react-hook-form'

import FormError from '../components/alerts/FormError';

import { Link, useNavigate } from 'react-router';

import { login as authLogin } from '../features/auth/authSlice.js';
import { useDispatch } from 'react-redux';
import { login as userLogin } from '../api/users.api.js';

export default function LogIn() {

    const [pwdVisibility, setPwdVisibility] = useState(false);

    const { register, handleSubmit, formState: { errors } } = useForm();
    const [snackAlert, setSnackAlert] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const login = async (data) => {
        const {usernameOrEmail, password} = data;
        const response = await userLogin(usernameOrEmail, password);
        
        if(response.statuscode === 200){
            console.log(response.data);
            
            localStorage.setItem("mingleUserState",JSON.stringify(response.data.user))
            localStorage.setItem("mingleAccessToken",response.data.accessToken)
            localStorage.setItem("mingleRefreshToken",response.data.refreshToken)
            dispatch(authLogin(response.data.user));
            navigate('/');
        }
    }

    return (
        <>
            <Typography
                variant='h2'
                textAlign={'center'}
                sx={{ m: 4, mt: 6 }}
            >
                mingle
                <EmojiPeopleIcon sx={{ fontSize: "inherit", mb: -1 }} />
            </Typography>
            <Container
                className='signContainer greyBorder'
            >
                <Typography variant='h5' sx={{ mb: 4, ml: 1 }}>
                    Login
                </Typography>
                <Box component="form" onSubmit={handleSubmit(login)} sx={{ flexGrow: 1 }}>
                    <Grid container spacing={{ xs: 2, md: 3 }}>
                        <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                            <TextField
                                label='Username or email'
                                type='text'
                                error={errors.usernameOrEmail && true}
                                fullWidth
                                {...register("usernameOrEmail", {
                                    required: true,
                                    maxLength: 254
                                })}
                            />
                            {errors.usernameOrEmail && errors.usernameOrEmail.type === 'required' && (
                                <FormError message="Username or email is required" />
                            )}
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                            <TextField
                                label='Password'
                                type={pwdVisibility ? "text" : "password"}
                                error={errors.password && true}
                                fullWidth
                                slotProps={{
                                    input: {
                                        endAdornment: <InputAdornment position="end">
                                            <IconButton onClick={() => setPwdVisibility(!pwdVisibility)}>
                                                {pwdVisibility ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>,
                                    },
                                }}
                                {...register("password", {
                                    required: true,
                                })}
                            />
                            {errors.password && errors.password.type === 'required' && (
                                <FormError message="Password is required" />
                            )}
                        </Grid>
                        <Grid size={{ xs: 12, sm: 12, md: 12 }}>
                            <Button
                                fullWidth
                                size='large'
                                variant='contained'
                                type='submit'
                            >
                                Log in
                            </Button>
                        </Grid>
                    </Grid>
                    <Typography sx={{ textAlign: "center", mt: 2, mb: 2 }}> or </Typography>
                    <Button
                        fullWidth
                        size='large'
                        startIcon={<GoogleIcon />}
                    >
                        Login with Google
                    </Button>
                </Box>
            </Container>
            <Typography 
                sx={{ textAlign: "center", mt: 2, mb: 2}}
            > 
                Don't have an account? 
                <Link to={"/signup"} className='redirect'> Create Account </Link> 
            </Typography>
        </>
    )
}