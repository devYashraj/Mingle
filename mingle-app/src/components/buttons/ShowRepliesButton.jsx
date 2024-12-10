import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { IconButton, Typography, Collapse } from '@mui/material';
import { useState } from 'react';

import ReplyList from '../lists/ReplyList';
import CommentInput from '../inputs/CommentInput';

import { myProfile } from '../../utils/sampleData';

export default function ShowRepliesButton({ commentId, ...rest }) {

    const [open, setOpen] = useState(false);

    const [reply, setReply] = useState("");

    const postReply = () =>{
        console.log("Sending reply to ",commentId);
    }

    return (
        <>
            <IconButton 
                {...rest}
                onClick={() => setOpen(!open)}
            >
                {
                    open ? <ExpandLessIcon /> : <ExpandMoreIcon />
                }
                <Typography component="span" variant="caption">
                    {`View replies`}
                </Typography>
            </IconButton>
            <Collapse in={open} unmountOnExit>
                <CommentInput 
                    value={reply}
                    onChange={(e)=>setReply(e.target.value)}
                    placeholder="Reply..."
                    avatar={myProfile.avatar}
                    fullName={myProfile.fullName}
                    handler={postReply}
                />
                <ReplyList styles={{bgcolor:"background.paper", pl:5}} />
            </Collapse>
        </>
    )
}