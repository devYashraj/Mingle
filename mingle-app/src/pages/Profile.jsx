import TwoColumnLayout from '../components/layouts/TwoColumnLayout.jsx';
import ProfileTemplate from '../components/templates/ProfileTemplate.jsx';
import UserActivityLayout from '../components/layouts/UserActivityLayout.jsx';
import { useParams } from 'react-router';
import { useState, useEffect } from 'react';
import { otherUserProfile } from '../utils/sampleData.js';
import Loading from '../utils/Loading.jsx';


export default function Profile() {
    const { username } = useParams();
    const [profileData, setProfileData] = useState({});
    const [loading, setLoading] = useState(true);
    
    useEffect(()=>{
        const getProfileData = () => {
            try {
                setProfileData(otherUserProfile);
            } catch (error) {
                
            } finally{
                setLoading(false);
            }
        }
        getProfileData();
    },[])

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