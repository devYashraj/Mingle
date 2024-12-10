import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import LikeButton from '../buttons/LikeButton';
import DeleteButton from '../buttons/DeleteButton';
import { useState } from 'react';


export default function ReplyTemplate({ reply }) {

    const [like, setLike] = useState(reply.liked)

    const handleLike = () => {
        setLike(!like)
    }

    // const owner = reply._id === "myId";
    const owner = true;
    
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
                        <Typography component="div" variant='caption' className='tags'>
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
                    likesCount={reply.likesCount}
                />
            </ListItem>
            <Divider component="li" />
        </>
    )
}