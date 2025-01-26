import apiClient from "./index.js";
import asyncHandler from '../utils/asyncHandler.js';

const login = asyncHandler(async (usernameOrEmail, password) => {

    const response = await apiClient.post(
        '/users/login',
        { username: usernameOrEmail, email: usernameOrEmail, password }
    )

    const { token } = response.data;
    localStorage.setItem("mingleAuthToken", token);
    return response.data;
})

export {
    login
}