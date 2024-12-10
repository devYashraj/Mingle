import ProfilePageLayout from '../components/layouts/ProfilePageLayout.jsx';
import ProfileTemplate from '../components/templates/ProfileTemplate.jsx';
import UserActivityLayout from '../components/layouts/UserActivityLayout.jsx';

import { otherUserProfile } from '../utils/sampleData.js';


export default function Profile() {
    return (
        <>
            <ProfilePageLayout
                left={<ProfileTemplate small={false} profileData={otherUserProfile} />}
                right={<UserActivityLayout />}
            />
        </>
    )
}