import FeedLayout from "../components/layouts/FeedLayout"
import ProfileTemplate from "../components/templates/ProfileTemplate"
import TrendingTemplate from "../components/templates/TrendingTemplate"
import PostList from "../components/lists/PostList.jsx"

import { myProfile } from "../utils/sampleData"

export default function Feed() {
    return (
        <>
            <FeedLayout
                left={<ProfileTemplate small={true} profileData={myProfile} />}
                middle={<PostList feed={true}/>}
                right={<TrendingTemplate />}
            />
        </>
    )
}


