import ThreeColumnLayout from "../components/layouts/ThreeColumnLayout"
import PostTemplate from "../components/templates/PostTemplate"
import ProfileTemplate from "../components/templates/ProfileTemplate"
import TrendingTemplate from "../components/templates/TrendingTemplate"
import CommentList from "../components/lists/CommentList"
import CommentInput from "../components/inputs/CommentInput"
import { useParams } from "react-router"
import { useState, useEffect } from "react"
import Loading from "../utils/Loading"

import { myProfile, postData as newPostData} from "../utils/sampleData"

export default function Post() {
    const { postID } = useParams(); 
    const [comment, setComment] = useState("");
    const [postData, setPostData] = useState({});
    const [loading, setLoading] = useState(true);

    const postComment = () =>{
        //comment for a post
        console.log(comment);
    }

    useEffect(()=>{
        const getPost = () => {
            try {
                setPostData(newPostData);
            } catch (error) {
                
            }
            finally{
                setLoading(false);
            }        
        }
        getPost();
    },[postID])

    return (
        <>
            <ThreeColumnLayout
                left={<ProfileTemplate small={true} profileData={myProfile} />}
                middle={
                    loading ?
                    <Loading color='secondary' size='4rem'/>
                    :
                    <>
                        <PostTemplate postData={postData} />
                        <CommentInput
                            value={comment}
                            onChange={(e)=>setComment(e.target.value)}
                            avatar={myProfile.avatar}
                            fullName={myProfile.fullName}
                            placeholder="Comment..."
                            handler={postComment}
                        />
                        <CommentList postId = {postData._id}/>
                    </>
                }
                right={<TrendingTemplate />}
            />
        </>
    )
}