import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
    Box, Container, Avatar, IconButton, Tooltip, Typography,
    TextField, Grid2 as Grid, Stack, InputAdornment, Button
} from "@mui/material";
import DeleteButton from '../buttons/DeleteButton';
import InsertLinkIcon from '@mui/icons-material/InsertLink';
import SendIcon from '@mui/icons-material/Send';
import { VisuallyHiddenInput, urlGenerator } from '../../utils/commonFunctions';

const schema = yup.object().shape({
    firstName: yup.string().required("First name is required").max(30, "First Name is too long"),
    lastName: yup.string().required("Last name is required").max(30, "Last Name is too long"),
    headline: yup.string().max(100, "Headline is too long"),
    biography: yup.string().max(500, "Biography is too long"),
    publicUrls: yup.array().of(
        yup.string().url("Invalid URL").required("URL cannot be empty")
    )
});

import { useSelector, useDispatch } from 'react-redux';
import { updateMyProfile } from "../../api/users.api";
import {login as authLogin} from '../../features/auth/authSlice';
import { setSuccessAlert, setErrorAlert } from "../../features/alert/alertSlice";

export default function EditProfileTemplate() {
    const myProfile = useSelector((state)=>state.auth.userData);
    const [myAvatar, setMyAvatar] = useState(myProfile.avatar);
    const [avatarFile, setAvatarFile] = useState(null);
    const firstName = myProfile.fullname.split(' ')[0]
    const lastName = myProfile.fullname.split(' ')[1]
    const dispatch = useDispatch();
    const initialValues = {...myProfile, firstName, lastName};
    const {
        control,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors },
    } = useForm({
        defaultValues: initialValues,
        resolver: yupResolver(schema),
    });

    const publicUrls = watch("publicUrls");
    const [newUrl, setNewUrl] = useState("");

    const handleUrlDelete = (url) => {
        const updatedUrls = publicUrls.filter((u) => u !== url);
        setValue("publicUrls", updatedUrls);
    };

    const addNewUrlWithKey = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const newurl = e.target.value.trim();
            if (!(newurl.length === 0) && !publicUrls.includes(newurl) && publicUrls.length < 4) {
                setValue("publicUrls", [...publicUrls, newurl]);
                e.target.value = "";
            }
        }
    };

    const addNewUrl = () => {
        if (!(newUrl.length === 0) && !publicUrls.includes(newUrl) && publicUrls.length < 4) {
            setValue("publicUrls", [...publicUrls, newUrl]);
            setNewUrl("");
        }
    };

    const handleAvatarChange = (e) => {
        const files = e.target.files;
        if(files?.length !== 0)
        {
            const url = urlGenerator(e.target.files)[0];
            setMyAvatar(url);
            setAvatarFile(files[0]);
        }
        else
        {
            setMyAvatar(myProfile.avatar);
        }
    }

    const onSubmit = async (data) => {
        if(myAvatar !== myProfile.avatar)
        {
            data.avatar = avatarFile;
        }
        delete data.username;
        delete data.email;
        delete data.createdAt;
        delete data.follow;
        delete data.followers;
        delete data.following;
        
        try {
            const response = await updateMyProfile(data);
            if(response.statuscode === 200){
                dispatch(authLogin(response.data));
                dispatch(setSuccessAlert("Profile updated. Please refresh!"));
            }
        } catch (error) {
            dispatch(setErrorAlert(error?.response?.data?.message))
        }
    };

    return (
        <Container className="greyBorder" sx={{ p: 2 }}>
            <Box className="centered">
                <Tooltip title="Upload New Avatar">
                    <IconButton component='label' tabIndex={-1}>
                        <Avatar alt={myProfile.fullname} src={myAvatar} sx={{ width: 72, height: 72 }} />  
                        <VisuallyHiddenInput
                            type='file'
                            multiple={false}
                            accept={'image/*'}
                            onChange={handleAvatarChange}
                        />
                    </IconButton>
                </Tooltip>
                <Typography sx={{ p: 1 }}>{`Username - @${myProfile.username}`}</Typography>
                <Typography variant="caption">{`Email - ${myProfile.email}`}</Typography>
            </Box>

            <Grid component='form' onSubmit={handleSubmit(onSubmit)} container spacing={{ xs: 3 }} >
                <Grid size={{ xs: 12 }}>
                    <Stack direction="row" spacing={1}>
                        <Controller
                            name="firstName"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="First Name*"
                                    error={!!errors.firstName}
                                    helperText={errors.firstName?.message}
                                />
                            )}
                        />
                        <Controller
                            name="lastName"
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label="Last Name*"
                                    error={!!errors.lastName}
                                    helperText={errors.lastName?.message}
                                />
                            )}
                        />
                    </Stack>
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <Controller
                        name="headline"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                label="Headline"
                                error={!!errors.headline}
                                helperText={errors.headline?.message}
                            />
                        )}
                    />
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <Controller
                        name="biography"
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                label="Biography"
                                multiline
                                error={!!errors.biography}
                                helperText={errors.biography?.message}
                            />
                        )}
                    />
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <Stack direction="column" spacing={2}>
                        <Typography textAlign="center">Public URLs</Typography>
                        {publicUrls.map((url, index) => (
                            <TextField
                                key={index}
                                disabled
                                value={url}
                                error={!!errors.publicUrls?.[index]}
                                helperText={errors.publicUrls?.[index]?.message}
                                slotProps={{
                                    input: {
                                        endAdornment:
                                            <InputAdornment position="end">
                                                <DeleteButton onClick={() => handleUrlDelete(url)} />
                                            </InputAdornment>
                                    }
                                }}
                            />
                        ))}
                        <TextField
                            value={newUrl}
                            onChange={(e)=>setNewUrl(e.target.value)}
                            fullWidth
                            placeholder="Enter new URL"
                            slotProps={{
                                input: {
                                    startAdornment:
                                        <InputAdornment position="start">
                                            <InsertLinkIcon />
                                        </InputAdornment>,
                                    endAdornment:
                                        <InputAdornment position='end'>
                                            <IconButton
                                                color='secondary'
                                                onClick={addNewUrl}
                                            >
                                                <SendIcon fontSize='small' />
                                            </IconButton>
                                        </InputAdornment>
                                }
                            }}
                            onKeyDown={addNewUrlWithKey}
                        />
                    </Stack>
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <Typography textAlign="center">
                        <Button 
                            color="inherit"
                            onClick={()=>{
                                window.scrollTo(0,0)
                                reset()
                            }}
                        >
                            Cancel
                        </Button>
                        <Button 
                            type="submit"   
                            color="primary"
                            variant="outlined"
                        >
                            Update
                        </Button>
                    </Typography>
                </Grid>
            </Grid>
        </Container>
    );
}
