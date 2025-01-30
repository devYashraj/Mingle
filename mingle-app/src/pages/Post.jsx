import ThreeColumnLayout from "../components/layouts/ThreeColumnLayout"
import PostTemplate from "../components/templates/PostTemplate"
import ProfileTemplate from "../components/templates/ProfileTemplate"
import TrendingTemplate from "../components/templates/TrendingTemplate"
import CommentList from "../components/lists/CommentList"
import CommentInput from "../components/inputs/CommentInput"
import { useParams, useNavigate } from "react-router"
import { useState, useEffect } from "react"
import Loading from "../utils/Loading"
import { useDispatch, useSelector } from "react-redux";

import { getPostById } from "../api/posts.api"
import { postComment as postCommentByPostId} from "../api/comments.api"
import { setErrorAlert, setSuccessAlert } from "../features/alert/alertSlice"

export default function Post() {
    const { postID } = useParams(); 
    const [refresh, setRefresh] = useState(crypto.randomUUID());
    const [comment, setComment] = useState("");
    const [postData, setPostData] = useState({});
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const myProfile = useSelector((state)=>state.auth.userData);
    const navigate = useNavigate();
    
    const postComment = async () =>{
        try {
            if(comment.trim()){
                const response = await postCommentByPostId(postID, comment.trim());
                if(response.statuscode === 201){
                    setComment("");
                    dispatch(setSuccessAlert("Comment posted successfully"))
                    setRefresh(crypto.randomUUID());
                }
            }
        } catch (error) {
            
        }
    }

    const getPost = async () => {
        try {
            setLoading(true);
            const response = await getPostById(postID);
            if(response.statuscode === 200){
                setPostData(response.data.post)
            }
        } 
        catch (error) {
            dispatch(setErrorAlert("Failed to load post"));
            navigate('/');
        }
        finally{
            setLoading(false);
        }        
    }

    useEffect(()=>{
        
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
                        <CommentList postId = {postData._id} refresh={refresh}/>
                    </>
                }
                right={<TrendingTemplate />}
            />
        </>
    )
}