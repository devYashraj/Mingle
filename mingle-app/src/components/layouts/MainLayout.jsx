import Navbar from '../header/Navbar.jsx';
import Footer from '../footer/Footer.jsx';
import CreateNewButton from '../buttons/CreateNewButton.jsx';
import { Outlet } from 'react-router';

export default function MainLayout() {
    return (
        <>
            <Navbar/>
            <Outlet/>
            <CreateNewButton color="primary"/>
            <Footer/>
        </>
    )
}