import { BrowserRouter, Routes, Route } from 'react-router';
import { useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

import SignUp from './pages/SignUp.jsx';
import LogIn from './pages/LogIn.jsx';
import MainLayout from './components/layouts/MainLayout.jsx';

import Feed from './pages/Feed.jsx';
import Search from './pages/Search.jsx';
import Tags from './pages/Tags.jsx';
import Post from './pages/Post.jsx';
import AuthLayout from './components/layouts/AuthLayout.jsx';
import Profile from './pages/Profile.jsx';
import MyProfile from './pages/MyProfile.jsx';
import Create from './pages/Create.jsx';
import ErrorPage from './utils/ErrorPage.jsx';
import { themes } from './utils/themes.js';

function Redirect() {
    const navigate = useNavigate();
    useEffect(() => {
        navigate('/login');
    }, [])
}


export default function App() {

    const themeName = useSelector(state => state.theme.themeName)
    const theme = createTheme(themes[themeName]);

    return (
        <>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <BrowserRouter >
                    <Routes >
                        <Route path='/'>

                            <Route index element={<Redirect />} />

                            <Route element={<AuthLayout auth={false} />}>
                                <Route path='login' element={<LogIn />} /> //done
                            </Route>

                            <Route element={<AuthLayout auth={false} />}>
                                <Route path='signup' element={<SignUp />} /> //done
                            </Route>

                            <Route element={<MainLayout />}>

                                <Route element={<AuthLayout auth={true} />}>
                                    <Route path='create' element={<Create />} />
                                </Route>

                                <Route element={<AuthLayout auth={true} />}>
                                    <Route path='search' element={<Search />} />
                                </Route>

                                <Route element={<AuthLayout auth={true} />}>
                                    <Route path='feed' element={<Feed />} /> 
                                </Route>

                                <Route element={<AuthLayout auth={true} />}>
                                    <Route path='tag/:tag' element={<Tags/>} />
                                </Route>

                                <Route element={<AuthLayout auth={true} />}>
                                    <Route path='post/:postID' element={<Post />} /> 
                                </Route>

                                <Route element={<AuthLayout auth={true} />}>
                                    <Route path='myprofile/:action' element={<MyProfile />} />
                                </Route>

                                <Route element={<AuthLayout auth={true} />}>
                                    <Route path='profile/:username/:action' element={<Profile />} />
                                </Route>

                            </Route>

                            <Route path='*' element={<ErrorPage/>}/>

                        </Route>
                    </Routes>
                </BrowserRouter>
            </ThemeProvider>
        </>
    )
}