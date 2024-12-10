import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router'

import './App.css'

import SignUp from './pages/SignUp.jsx';
import LogIn from './pages/LogIn.jsx';
import MainLayout from './components/layouts/MainLayout.jsx';

const lightTheme = {
    palette: {
        mode: 'light',
        primary: {
            main: '#1976d2', // Blue
            contrastText: '#ffffff',
        },
        secondary: {
            main: '#f50057', // Pink
            contrastText: '#ffffff',
        },
        background: {
            default: '#f5f5f5',
            paper: '#ffffff',
        },
        text: {
            primary: '#000000',
            secondary: '#666666',
        },
    },
};


const neonTheme = {
    palette: {
        mode: 'dark',
        primary: {
            main: '#00e676', // Neon Green
            contrastText: '#000000',
        },
        secondary: {
            main: '#ff9100', // Neon Orange
            contrastText: '#000000',
        },
        background: {
            default: '#212121',
            paper: '#303030',
        },
        text: {
            primary: '#ffffff',
            secondary: '#bdbdbd',
        },
    },
};

import App from './App.jsx';
import Feed from './pages/Feed.jsx';
import Post from './pages/Post.jsx';
import AuthLayout from './components/layouts/AuthLayout.jsx';
import Profile from './pages/Profile.jsx';
import CommentList from './components/lists/CommentList.jsx';
import MyProfile from './pages/MyProfile.jsx';

const theme = createTheme(neonTheme);

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' element={<App />}>

            <Route index element={<AuthLayout auth={true} />}/>

            <Route element={<AuthLayout auth={false} />}>
                <Route path='login' element={<LogIn />} /> //done
            </Route>

            <Route element={<AuthLayout auth={false} />}>
                <Route path='signup' element={<SignUp />} /> //done
            </Route>


            <Route element={<MainLayout />}>

                <Route element={<AuthLayout auth={true} />}>
                    <Route path='feed' element={<Feed />} /> //done
                </Route>

                <Route element={<AuthLayout auth={true} />}>
                    <Route path='tag/:tagName' element={<div>Tag Search Results</div>} />
                </Route>

                <Route element={<AuthLayout auth={true} />}>
                    <Route path='post/:postID' element={<Post />} /> //done
                </Route>

                <Route element={<AuthLayout auth={true} />}>
                    <Route path='myprofile' element={<MyProfile/>} />
                </Route>

                <Route element={<AuthLayout auth={true} />}>
                    <Route path='profile/:username' element={<Profile/>} />
                </Route>

                <Route path='test/comment' element={<CommentList postId={"1234"}/>} />
            </Route>

        </Route>
    )
);

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <RouterProvider router={router} future={{ v7_startTransition: true, }} />
        </ThemeProvider>
    </StrictMode>
)
