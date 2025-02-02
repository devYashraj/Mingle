import ProfileTemplate from "../components/templates/ProfileTemplate"
import PostList from "../components/lists/PostList"
import TrendingTemplate from "../components/templates/TrendingTemplate"
import ThreeColumnLayout from "../components/layouts/ThreeColumnLayout"
import { useSelector } from "react-redux"
import { useParams } from "react-router"
import { getPostsByTag } from "../api/posts.api"
import { Typography } from "@mui/material"

export default function Tags() {

    const myProfile = useSelector((state)=>state.auth.userData);
    const refreshId = crypto.randomUUID();
    const { tag } = useParams();
    
    return (
        <>
            
            <ThreeColumnLayout
                left={<ProfileTemplate small={true} profileData={myProfile}/>}
                middle={
                    <>
                        <Typography variant="overline">Showing results for #{tag}</Typography>
                        <PostList func={(page)=>getPostsByTag(tag,page)} refreshId={refreshId}/>
                    </>
                }
                right={<TrendingTemplate/>}
            />
        </>
    )
}