import TwoColumnLayout from '../components/layouts/TwoColumnLayout.jsx';
import ProfileTemplate from '../components/templates/ProfileTemplate.jsx';
import UserActivityLayout from '../components/layouts/UserActivityLayout.jsx';
import { useParams } from 'react-router';

import { otherUserProfile } from '../utils/sampleData.js';


export default function Profile() {

    const { username } = useParams();
    
    return (
        <>
            <TwoColumnLayout
                left={<ProfileTemplate small={false} profileData={otherUserProfile} />}
                right={<UserActivityLayout self={false} username={username} />}
            />
        </>
    )
}