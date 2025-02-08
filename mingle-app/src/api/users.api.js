import apiClient from "./index.js";
import asyncHandler from '../utils/asyncHandler.js';

const login = asyncHandler(async (usernameOrEmail, password) => {

    const response = await apiClient.post(
        '/users/login',
        { username: usernameOrEmail, email: usernameOrEmail, password }
    )

    return response.data;
})

const register = asyncHandler(async (data) => {
    const response = await apiClient.post('/users/register', data);

    return response.data;
})

const logout = asyncHandler(async () => {
    const response = await apiClient.post('/users/logout');
    return response.data;
})

const getMyProfileData = asyncHandler(async () => {
    const response = await apiClient.get('/users/myprofile');
    return response.data;
})

const getUserProfileData = asyncHandler(async (username) => { 
    const response = await apiClient.get(`/users/profile/${username}`);
    return response.data;
})

const updateMyProfile = asyncHandler(async (data) =>{

    const response = await apiClient.patch('/users/update-profile', data, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    })

    return response.data;
})

const changePassword = asyncHandler(async (data) => {

    const response = await apiClient.patch('/users/change-password', data);

    return response.data;
})

const getUserList = asyncHandler( async (searchQuery) => {

    const response =  await apiClient.get(`/users/userlist/${searchQuery}`);

    return response.data;
})

export {
    login,
    register,
    logout,
    getMyProfileData,
    getUserProfileData,
    updateMyProfile,
    getUserList,
    changePassword
}