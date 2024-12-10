import { IconButton } from "@mui/material"
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

export default function SaveButton({ saved, ...rest}) {
    return (
        <>
            <IconButton
                {...rest}
            >
                {
                    saved ?
                        <BookmarkIcon
                            fontSize='small'
                            color="secondary"
                        /> :
                        <BookmarkBorderIcon
                            fontSize='small'
                        />
                }
            </IconButton>
        </>
    )
}