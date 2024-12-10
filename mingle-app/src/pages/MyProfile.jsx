import ProfilePageLayout from '../components/layouts/ProfilePageLayout.jsx';
import ProfileTemplate from '../components/templates/ProfileTemplate.jsx';
import UserActivityLayout from '../components/layouts/UserActivityLayout.jsx';

import { myProfile } from '../utils/sampleData.js';


export default function MyProfile() {
    return (
        <>
            <ProfilePageLayout
                left={<ProfileTemplate small={false} profileData={myProfile} />}
                right={<UserActivityLayout />}
            />
        </>
    )
}