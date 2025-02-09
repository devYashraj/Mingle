import { Box } from "@mui/material";

export default function Typing() {
    return (
        <>
            <Box className="chat-bubble" sx={{bgcolor:'background.paper'}}>
                <Box className="typing">
                    <Box className="dot"></Box>
                    <Box className="dot"></Box>
                    <Box className="dot"></Box>
                </Box>
            </Box>
        </>
    )
}