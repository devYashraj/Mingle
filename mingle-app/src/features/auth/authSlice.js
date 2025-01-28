import { createSlice } from "@reduxjs/toolkit";

const mingleUserState = JSON.parse(localStorage.getItem("mingleUserState"))

const initialState = mingleUserState ?
{
    status: true,
    userData: mingleUserState
}
:
{
    status: false,
    userData: null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.status = true;
            state.userData = action.payload;
            localStorage.setItem("mingleUserState",JSON.stringify(action.payload));
        },
        logout: (state, action) => {
            localStorage.removeItem("mingleUserState")
            localStorage.removeItem("mingleAccessToken")
            localStorage.removeItem("mingleRefreshToken")
            state.status = false;
            state.userData = null
        }
    }
})

export const {login, logout} = authSlice.actions;

export default authSlice.reducer;