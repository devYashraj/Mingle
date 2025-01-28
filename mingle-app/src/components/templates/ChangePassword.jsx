import { Container, TextField, Button } from '@mui/material';
import { Grid2 as Grid } from '@mui/material';
import { useForm } from 'react-hook-form';
import FormError from '../alerts/FormError';
import { changePassword as changePasswordAPI } from '../../api/users.api';
import { useDispatch } from 'react-redux';
import { setSuccessAlert, setErrorAlert } from '../../features/alert/alertSlice.js';

export default function ChangePassword() {

    const { register, reset, watch, handleSubmit, formState: {errors} } = useForm({
        defaultValues: {
            oldPassword: "",
            newPassword: "",
            confirmPassword: ""
        }
    });
    const password = watch("newPassword");
    const dispatch = useDispatch();

    const changePassword = async (data) => {
        try {
            const response = await changePasswordAPI(data);
            if(response.statuscode === 200){
                dispatch(setSuccessAlert(response.message))
                reset();
            }
        } 
        catch (error) 
        {
            dispatch(setErrorAlert(error?.response?.data?.message))
        }
    }

    return (
        <>
            <Container className="greyBorder centered">
                <Grid component='form' noValidate onSubmit={handleSubmit(changePassword)} container spacing={{ xs: 3 }} >
                    <Grid size={{xs:12}}>
                        <TextField 
                            label="Old Password"
                            type='password'
                            fullWidth 
                            {...register('oldPassword',{
                                required: true,
                                maxLength: 100
                            })}
                        />
                        {errors.oldPassword && errors.oldPassword.type === 'required' && (
                            <FormError message="Old Password is required" />
                        )}
                        {errors.oldPassword && errors.oldPassword.type === 'maxLength' && (
                            <FormError message="Password is too long" />
                        )}
                    </Grid>
                    <Grid size={{xs:12}}>
                        <TextField 
                            label="New Password"
                            type='password'
                            fullWidth 
                            {...register('newPassword',{
                                required: true,
                                maxLength: 100,
                                minLength: 8
                            })}
                        />
                        {errors.newPassword && errors.newPassword.type === 'required' && (
                            <FormError message="New Password is required" />
                        )}
                        {errors.newPassword && errors.newPassword.type === 'maxLength' && (
                            <FormError message="Password is too long" />
                        )}
                        {errors.newPassword && errors.newPassword.type === 'minLength' && (
                            <FormError message="Password is too short" />
                        )}
                    </Grid>
                    <Grid size={{xs:12}}>
                        <TextField 
                            label="Confirm New Password"
                            type='password'
                            fullWidth    
                            {...register("confirmPassword", {
                                required: true,
                                validate: value => value === password || "Passwords do not match"
                            })} 
                        />
                        {errors.confirmPassword && (
                            <FormError message={errors.confirmPassword.message}/>
                        )}
                    </Grid> 
                    <Button 
                        fullWidth 
                        variant='contained' 
                        color='secondary'
                        type='submit'
                    >
                        Change Password
                    </Button>
                </Grid>
            </Container>
        </>
    )
}