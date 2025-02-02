import ProfileTemplate from "../components/templates/ProfileTemplate"
import PostList from "../components/lists/PostList"
import TrendingTemplate from "../components/templates/TrendingTemplate"
import ThreeColumnLayout from "../components/layouts/ThreeColumnLayout"
import { useSelector } from "react-redux"
import { useSearchParams } from "react-router"
import { getSearchPosts } from "../api/posts.api"
import { Typography } from "@mui/material"

export default function Search() {

    const myProfile = useSelector((state)=>state.auth.userData);
    const [searchParams, setSearchParams] = useSearchParams();
    const searchQuery = searchParams.get('search'); 

    const resfreshId = crypto.randomUUID();
    
    return (
        <>
            <ThreeColumnLayout
                left={<ProfileTemplate small={true} profileData={myProfile}/>}
                middle={
                    <>
                        <Typography variant="overline">Showing results for "{searchQuery}"</Typography>
                        <PostList func={(page)=>getSearchPosts(searchQuery,page)} refreshId={resfreshId}/>
                    </>
                }
                right={<TrendingTemplate/>}
            />
        </>
    )
}