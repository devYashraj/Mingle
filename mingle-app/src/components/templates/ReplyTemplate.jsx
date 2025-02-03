import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import LikeButton from '../buttons/LikeButton';
import DeleteButton from '../buttons/DeleteButton';
import { useState } from 'react';
import { likeUnlikeComment } from "../../api/likes.api.js";
import { useNavigate } from 'react-router';

export default function ReplyTemplate({ reply, myProfile }) {

    const [like, setLike] = useState(reply.liked)
    const [likes, setLikes] = useState(reply.likesCount)
    const navigate = useNavigate();
    
    const handleLike = async () => {
        try {
            const response = await likeUnlikeComment(reply._id);
            const { liked } = response.data;
            if(liked){   
                setLike(true);
                setLikes((like)=>like+1)
            }
            else{
                setLike(false);
                setLikes((like)=>like-1)
            }
        } catch (error) {
            
        }
    }

    const handleProfileNavigate = (username) => {
        if (myProfile.username === username)
            navigate("/myprofile/posts");
        else
            navigate(`/profile/${username}/posts`);
    }

    const owner = reply.username === myProfile.username;
    
    return (
        <>
            <ListItem alignItems="flex-start"
                secondaryAction={
                    owner &&
                    <DeleteButton
                        onClick={() => handleCommentDelete(reply._id)}
                        sx={{ mb: 4 }}
                    />
                }
            >
                <ListItemAvatar>
                    <Avatar
                        alt={reply.fullName}
                        src={reply.avatar}
                    />
                </ListItemAvatar>
                <ListItemText
                    primary={
                        <Typography component="div" variant='caption' className='tags'
                            onClick={() => handleProfileNavigate(reply.username)}
                        >
                            
                            {"@" + reply.username}
                        </Typography>
                    }
                    secondary={
                        <Typography component="span" variant='body2' color='text.primary' className='comment'>
                            {reply.text}
                        </Typography>
                    }
                />
            </ListItem>
            <ListItem sx={{ m: 0, p: 0, pl: 7 }}>
                <LikeButton
                    onClick={handleLike}
                    liked={like}
                    likesCount={likes}
                />
            </ListItem>
            <Divider component="li" />
        </>
    )
}