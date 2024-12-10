import { IconButton, Typography } from "@mui/material";
import CommentIcon from '@mui/icons-material/Comment';

export default function CommentButton({ commentsCount, ...rest }) {

    
    return (
        <>
            <IconButton aria-label="share" {...rest}>
                <CommentIcon fontSize='small' />
                <Typography className='reactions'>{commentsCount}</Typography>
            </IconButton>
        </>
    )
}