import TwoColumnLayout from '../components/layouts/TwoColumnLayout.jsx';
import ProfileTemplate from '../components/templates/ProfileTemplate.jsx';
import UserActivityLayout from '../components/layouts/UserActivityLayout.jsx';

import { myProfile } from '../utils/sampleData.js';


export default function MyProfile() {
    return (
        <>
            <TwoColumnLayout
                left={<ProfileTemplate small={false} profileData={myProfile} />}
                right={<UserActivityLayout />}
            />
        </>
    )
}