import { createSlice } from "@reduxjs/toolkit";

const mingleUserState = JSON.parse(localStorage.getItem("mingleUserState"))

const initialState = mingleUserState ?
{
    severity: "success",
    message: `Welcome ${mingleUserState.fullname}`,
    uid: 'uid',
}
:
{
    severity: "error",
    message: 'User validation failed'
}

const alertSlice = createSlice({
    name: "globalAlert",
    initialState,
    reducers: {
        setErrorAlert: (state,action) => {
            state.severity = "error";
            state.message = action.payload;
            state.uid = self.crypto.randomUUID();
        },
        setSuccessAlert: (state,action) => {
            state.severity = "success";
            state.message = action.payload;
            state.uid = self.crypto.randomUUID();
        }
    }
})

export const {setErrorAlert, setSuccessAlert} = alertSlice.actions;

export default alertSlice.reducer;