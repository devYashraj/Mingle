import ThreeColumnLayout from "../components/layouts/ThreeColumnLayout"
import PostTemplate from "../components/templates/PostTemplate"
import ProfileTemplate from "../components/templates/ProfileTemplate"
import TrendingTemplate from "../components/templates/TrendingTemplate"
import CommentList from "../components/lists/CommentList"
import CommentInput from "../components/inputs/CommentInput"

import { useState } from "react"

import { myProfile, postData } from "../utils/sampleData"

export default function Post() {

    const [comment, setComment] = useState("");

    const postComment = () =>{
        //comment for a post
        console.log(comment);
    }

    return (
        <>
            <ThreeColumnLayout
                left={<ProfileTemplate small={true} profileData={myProfile} />}
                middle={
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