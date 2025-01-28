import TwoColumnLayout from '../components/layouts/TwoColumnLayout.jsx';
import ProfileTemplate from '../components/templates/ProfileTemplate.jsx';
import UserActivityLayout from '../components/layouts/UserActivityLayout.jsx';
import { useNavigate, useParams } from 'react-router';
import { useState, useEffect } from 'react';
import Loading from '../utils/Loading.jsx';
import { getUserProfileData } from '../api/users.api.js';
import { useDispatch } from 'react-redux';
import { setErrorAlert } from '../features/alert/alertSlice.js';

export default function Profile() {
    const { username } = useParams();
    const [profileData, setProfileData] = useState({});
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(()=>{ 
        const getProfileData = async () => {
            try {
                const response = await getUserProfileData(username);
                if(response.statuscode === 200){
                    setProfileData(response.data[0]);
                }
            } catch (error) {
                dispatch(setErrorAlert(error?.response?.data?.message));
                navigate('/feed');
                
            } finally{
                setLoading(false);
            }
        }
        getProfileData();
    },[username])

    return (
        loading ? 
        <Loading color='secondary' size='5rem'/>
        :
        <>
            <TwoColumnLayout
                left={<ProfileTemplate small={false} profileData={profileData} />}
                right={<UserActivityLayout self={false} username={username} />}
            />
        </>
    )
}