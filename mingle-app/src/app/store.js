import { configureStore } from '@reduxjs/toolkit';
import themeReducer from '../features/theme/themeSlice';
import authReducer from '../features/auth/authSlice';
import alertReducer from '../features/alert/alertSlice';

export const store = configureStore({
    reducer:{
        theme : themeReducer,
        auth: authReducer,
        globalAlert: alertReducer,
    }
})