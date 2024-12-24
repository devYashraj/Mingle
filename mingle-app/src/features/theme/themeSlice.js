import { createSlice } from "@reduxjs/toolkit";

const getInitialTheme = () => {
    const init = localStorage.getItem("mingle.theme");
    return (init) ? init : "Classic Light";
}

const initialState = { themeName: getInitialTheme() };

export const themeSlice = createSlice({
    name: "theme",
    initialState,
    reducers: {
        changeTheme: (state, action) => {
            state.themeName = action.payload
        }
    }
})

export const {changeTheme} = themeSlice.actions;

export default themeSlice.reducer;