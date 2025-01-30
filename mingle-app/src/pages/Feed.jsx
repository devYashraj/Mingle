import ThreeColumnLayout from "../components/layouts/ThreeColumnLayout"
import ProfileTemplate from "../components/templates/ProfileTemplate"
import TrendingTemplate from "../components/templates/TrendingTemplate"
import PostList from "../components/lists/PostList.jsx"
import { useSelector } from "react-redux"
import { getFeed } from '../api/posts.api.js'

export default function Feed() {

    const myProfile = useSelector((state)=>state.auth.userData);
    const refreshId = self.crypto.randomUUID();
    return (
        <>
            <ThreeColumnLayout
                left={<ProfileTemplate small={true} profileData={myProfile} />}
                middle={<PostList func={(page)=>getFeed(page)} refreshId={refreshId}/>}
                right={<TrendingTemplate />}
            />
        </>
    )
}


