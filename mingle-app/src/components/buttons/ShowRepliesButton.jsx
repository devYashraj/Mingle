import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { IconButton, Typography, Collapse } from '@mui/material';
import { useState } from 'react';
import ReplyList from '../lists/ReplyList';
import CommentInput from '../inputs/CommentInput';
import { getCommentReplies, postReply as postReplyByCommentId } from '../../api/comments.api';

export default function ShowRepliesButton({ myProfile, commentId, ...rest}) {

    const [open, setOpen] = useState(false);

    const [reply, setReply] = useState("");

    const [refresh, setRefresh] = useState(crypto.randomUUID());

    const postReply = async () =>{
        try {
            const response = await postReplyByCommentId(commentId, reply);
            if(response.statuscode === 201){
                setReply("");
                setRefresh(crypto.randomUUID());
            }
        } 
        catch (error) {
            
        }
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
                <ReplyList 
                    func={(page)=>getCommentReplies(commentId,page)}
                    refreshId={refresh}
                    styles={{bgcolor:"background.paper", pl:5}} 
                />
            </Collapse>
        </>
    )
}