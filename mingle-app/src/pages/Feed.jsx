import ThreeColumnLayout from "../components/layouts/ThreeColumnLayout"
import ProfileTemplate from "../components/templates/ProfileTemplate"
import TrendingTemplate from "../components/templates/TrendingTemplate"
import PostList from "../components/lists/PostList.jsx"
import { useSelector } from "react-redux"

export default function Feed() {

    const myProfile = useSelector((state)=>state.auth.userData);

    return (
        <>
            <ThreeColumnLayout
                left={<ProfileTemplate small={true} profileData={myProfile} />}
                middle={<PostList feed={true}/>}
                right={<TrendingTemplate />}
            />
        </>
    )
}


