import InputAdornment from '@mui/material/InputAdornment';
import { TextField, Avatar, IconButton, Divider, Box } from "@mui/material"
import SendIcon from '@mui/icons-material/Send';

export default function CommentInput({ fullName, avatar, handler, ...rest }) {
    return (
        <>
            <Box>
                <TextField
                    {...rest}
                    fullWidth
                    slotProps={{
                        input: {
                            startAdornment:
                                <InputAdornment position="start">
                                    <Avatar
                                        alt={fullName}
                                        src={avatar}
                                        sx={{ width: 24, height: 24 }}
                                    />
                                </InputAdornment>,
                            endAdornment:
                                <IconButton color="primary" onClick={handler}>
                                    <SendIcon />
                                </IconButton>
                        },
                    }}
                />
            </Box>
        </>
    )
}