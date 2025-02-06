import { Box, Typography } from "@mui/material"
import { sampelMessages } from "../../utils/sampleData"
import { AppBar, Toolbar } from "@mui/material"
import CommentInput from "../inputs/CommentInput"
import { IconButton, Stack, Avatar } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu';
import Loading from "../../utils/Loading";
import { useState, useEffect } from "react";
import { getFullDate } from '../../utils/formatter.js';
import { stringAvatar } from "../../utils/commonFunctions.js"

export default function MessageList({ myId, chatId, drawerWidth, handleDrawerToggle }) {

    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([]);
    const [currentChat, setCurrentChat] = useState({});

    const getMessages = (id) => {

        setMessages(sampelMessages);

    }

    const getCurrentChatDetails = (id) => {
        setCurrentChat({
            _id: "jhalskdjashdalskdjh",
            name: "Wal Kardin",
            isGroupChat: true,
            lastMessage: "Just finished my project last night. Going to relax today!",
            participants: [
                "asdasdaskjdlaskdajlsdkasda",
                "679608f420caca28e9cd1366",
            ],
            createdAt: new Date(2024, 10, 29, 16, 47, 22),
            updatedAt: new Date(2024, 10, 29, 16, 47, 22)
        })
    }

    useEffect(() => {
        getMessages(chatId);
        getCurrentChatDetails(chatId);
    }, [chatId])

    if (loading)
        return <Loading color="secondary" size="4rem" />

    return (
        <>
            <Toolbar />
            <AppBar
                position="fixed" enableColorOnDark
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, display: { sm: 'none' } }}
                    >
                        <MenuIcon />
                    </IconButton>

                    <Typography noWrap component="div">
                        <Stack direction="row" spacing={2}>
                            <Avatar {...stringAvatar(currentChat.name)} />
                            <Typography variant='h6' component="div">
                                {currentChat.name}
                                <Typography variant='subtitle2'>
                                    {`Last active ${getFullDate(currentChat.updatedAt)}`}
                                </Typography>
                            </Typography>
                        </Stack>
                    </Typography>

                </Toolbar>
            </AppBar>
            {
                messages.map((m) => (
                    <Box
                        key={m._id}
                        className={myId === m.sender ? "message sentMessage " : "message receivedMessage"}
                        sx={{ bgcolor: myId === m.sender ? "background.message" : "background.paper" }}
                    >
                        <Typography
                            variant="subtitle1"
                            component="div"
                        >
                            {
                                currentChat.isGroupChat &&
                                <Typography variant="caption" component="p" color="secondary">
                                    {myId === m.sender ? "You" : `${m.sendername} . ${m.username}`}
                                </Typography>
                            }
                                {m.content}
                            <Typography
                                variant="caption"
                                component="p"
                                textAlign='right'
                                color="textSecondary"
                            >
                                {getFullDate(m.createdAt)}
                            </Typography>
                        </Typography>
                    </Box>
                ))
            }
            <Toolbar />
            <AppBar
                position="fixed"
                sx={{
                    top: 'auto',
                    bottom: 0,
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                    bgcolor: 'background.default'
                }}
            >
                <CommentInput placeholder="Type new message" />
            </AppBar>
        </>
    )
}