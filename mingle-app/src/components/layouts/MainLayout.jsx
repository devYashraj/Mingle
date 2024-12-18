import Navbar from '../header/Navbar.jsx';
import Footer from '../footer/Footer.jsx';
import CreateNewButton from '../buttons/CreateNewButton.jsx';
import { useNavigate, Outlet } from 'react-router';

export default function MainLayout() {

    const navigate = useNavigate();
    
    return (
        <>
            <Navbar/>
            <Outlet/>
            <CreateNewButton 
                color="primary"
                onClick={()=>navigate('/create')}
            />
            <Footer/>
        </>
    )
}