import TwoColumnLayout from '../components/layouts/TwoColumnLayout.jsx';
import ProfileTemplate from '../components/templates/ProfileTemplate.jsx';
import UserActivityLayout from '../components/layouts/UserActivityLayout.jsx';
import Loading from '../utils/Loading.jsx';
import { useState, useEffect } from 'react';
import { getMyProfileData } from '../api/users.api.js';
import { useDispatch } from 'react-redux';
import { setErrorAlert } from '../features/alert/alertSlice.js';

export default function MyProfile() {

    const [loading, setLoading] = useState(true);
    const [myProfile, setMyprofile] = useState({});
    const dispatch = useDispatch();
                                                            
    useEffect(() => {
        const loadProfileData = async () => {
            try {
                const response = await getMyProfileData();
                if (response.statuscode === 200) {
                    setMyprofile(response.data[0]);
                }
            } catch (error) {
                dispatch(setErrorAlert(error?.response?.data?.message))
            }
            finally{
                setLoading(false);
            }
        }
        loadProfileData();
    }, [])

    return (
        <>
            {
                loading ?
                    <Loading color="secondary" size="2rem"  />
                    :
                    <TwoColumnLayout
                        left={<ProfileTemplate small={false} profileData={myProfile} />}
                        right={<UserActivityLayout />}
                    />
            }
        </>
    )
}