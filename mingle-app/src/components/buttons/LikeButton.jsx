import { IconButton, Typography } from "@mui/material";
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

import { formatCount } from "../../utils/formatter";

export default function LikeButton({ liked, likesCount, ...rest }) {
    return (
        <>
            <IconButton
                {...rest}
                aria-label="add to favorites"
                sx={{
                    color: liked && "#ff00ff"
                }}
                
            >
                {
                    liked ?
                        <FavoriteIcon fontSize='small' /> :
                        <FavoriteBorderIcon  fontSize='small'/>
                }

                <Typography className='reactions like'>{formatCount(likesCount)}</Typography>
            </IconButton>
        </>
    )
}