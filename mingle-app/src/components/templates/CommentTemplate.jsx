import { ListItem, ListItemAvatar, ListItemText } from "@mui/material";
import { Divider, Avatar, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import { IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

import ShowRepliesButton from "../buttons/ShowRepliesButton.jsx";
import LikeButton from "../buttons/LikeButton.jsx";
import CommentButton from "../buttons/CommentButton.jsx";
import DeleteButton from "../buttons/DeleteButton.jsx";
import { useState } from "react";
import { useSelector } from "react-redux";

export default function CommentTemplate({ comment }) {

    const navigate = useNavigate();

    const [like, setLike] = useState(comment.liked)
    const [likes, setLikes] = useState(comment.likesCount)

    const myProfile = useSelector((state)=>state.auth.userData);

    const handleLike = async () => {
        setLike(!like)
    }

    const owner = (comment.username === myProfile.username);


    const handleProfileNavigate = (username) => {
        const myProfile = userData;
        if (myProfile.username === username)
            navigate("/myprofile/posts");
        else
            navigate(`/profile/${username}/posts`);
    }

    const handleCommentDelete = () => {

    }

    return (
        <>
            <ListItem alignItems="flex-start"
                secondaryAction={
                    owner &&
                    <DeleteButton
                        onClick={handleCommentDelete}
                        sx={{ mb: 4 }}
                    />
                }
            >
                <ListItemAvatar>
                    <Avatar
                        alt={comment.fullName}
                        src={comment.avatar}
                    />
                </ListItemAvatar>
                <ListItemText
                    primary={
                        <Typography
                            onClick={() => handleProfileNavigate(comment.username)}
                            component="div" variant='caption' className='tags'>
                            {"@" + comment.username}
                        </Typography>
                    }
                    secondary={
                        <Typography component="span" variant='body2' color='text.primary' className='comment'>
                            {comment.text}
                        </Typography>
                    }
                />
            </ListItem>
            <ListItem sx={{ m: 0, p: 0, pl: 7 }}>
                <LikeButton
                    onClick={handleLike}
                    liked={like}
                    likesCount={comment.likesCount}
                />
                <CommentButton
                    commentsCount={comment.commentsCount}
                />
            </ListItem>
            {
                <ShowRepliesButton
                    commentId={comment._id}
                    myProfile={myProfile}
                    sx={{ m: 0, p: 0, ml: 7 }}
                />
            }
            <Divider component="li" />
        </>
    )
}