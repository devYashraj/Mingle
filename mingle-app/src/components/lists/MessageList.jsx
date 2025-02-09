import { Box, Typography } from "@mui/material"
import { sampelMessages } from "../../utils/sampleData"
import { AppBar, Toolbar } from "@mui/material"
import CommentInput from "../inputs/CommentInput"
import { IconButton, Stack, Avatar } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu';
import Loading from "../../utils/Loading";
import { useState, useEffect } from "react";
import { getFullDate } from '../../utils/formatter.js';
import { stringAvatar, getChatName } from "../../utils/commonFunctions.js"
import { getChatDetails } from "../../api/chats.api.js"
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export default function MessageList({myUsername, myId, chatId, drawerWidth, handleDrawerToggle }) {

    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const [currentChat, setCurrentChat] = useState({});

    const getMessages = (id) => {

        setMessages(sampelMessages);

    }

    const getCurrentChatDetails = async (id) => {
        const response = await getChatDetails(id);        
        setCurrentChat(response.data[0]);
    }

    const getInitData = async(id) => {
        try {
            await getCurrentChatDetails(id);
            getMessages(id);
        } 
        catch (error) {
            
        }
        finally{
            
            
            setLoading(false);
        }
    }

    useEffect(() => {
        setLoading(true);
        getInitData(chatId);
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
                                {getChatName(currentChat,myUsername)}
                                <Typography variant='subtitle2'>
                                    {`Last active ${getFullDate(currentChat.updatedAt)}`}
                                </Typography>
                            </Typography>
                            <IconButton color=''>
                                <InfoOutlinedIcon/>
                            </IconButton>
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