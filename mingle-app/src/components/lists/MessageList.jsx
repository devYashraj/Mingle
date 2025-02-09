import { Box, Typography } from "@mui/material"
import { AppBar, Toolbar } from "@mui/material"
import CommentInput from "../inputs/CommentInput"
import { IconButton, Stack, Avatar } from "@mui/material"
import MenuIcon from '@mui/icons-material/Menu';
import Loading from "../../utils/Loading";
import { useState, useEffect } from "react";
import { getFullDate } from '../../utils/formatter.js';
import { stringAvatar, getChatName, CHAT_EVENTS } from "../../utils/commonFunctions.js"
import { getChatDetails } from "../../api/chats.api.js"
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import Typing from "../../utils/Typing.jsx"
import { useSocket } from "../../context/SocketContext.jsx"
import { sendMessage, getAllMessages } from "../../api/messages.api.js"

export default function MessageList({myProfile, chatId, unreadMessages, setUnreadMessages, drawerWidth, handleDrawerToggle }) {

    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState([]);
    const [currentChat, setCurrentChat] = useState({});
    const myId = myProfile._id;
    const myUsername = myProfile.username;

    const getMessages = async (id) => {
        const response = await getAllMessages(id);
        setMessages(response.data);
    }

    const getCurrentChatDetails = async (id) => {
        const response = await getChatDetails(id);        
        setCurrentChat(response.data[0]);
    }

    const getInitData = async(id) => {
        try {
            await getCurrentChatDetails(id);
            await getMessages(id);
        } 
        catch (error) {
        }
        finally{
            setLoading(false);
        }
    }
        
    const socket = useSocket();
    const [typing, setTyping] = useState(false);
    const [newMsg, setNewMsg] = useState('');

    useEffect(() => {

        getInitData(chatId);
        setUnreadMessages((prev)=>[...prev].filter((m)=>m.chat!==chatId))
        localStorage.setItem("mingleUnreadMessages",unreadMessages.length)
        socket.emit(CHAT_EVENTS.JOIN_CHAT,chatId);

    }, [chatId])


    const onTyping = () => {
        setTyping(true);
    }

    const onStopTyping = () => {
        setTyping(false);
    }

    const handleTyping = (e) => {
        setNewMsg(e.target.value)

        socket.emit(CHAT_EVENTS.TYPING, chatId);

        setTimeout(()=>{
            socket.emit(CHAT_EVENTS.STOP_TYPING, chatId)
            setTyping(false);
        },3000)
    }

    const sendNewMessage = async() => {
        try {
            const response = await sendMessage(chatId,newMsg);
            setMessages((prev)=>[...prev, response.data])
            setNewMsg('');
        } 
        catch (error) {
            console.log(error?.message);
        }
    }

    const onMessageReceived = (msg) => {
        if(msg.chat === chatId){
            setMessages((prev)=>[...prev, msg])
        }
        else{
            setUnreadMessages((prev)=>[...prev, msg])
            localStorage.setItem("mingleUnreadMessages",unreadMessages.length)
        }
    }

    useEffect(()=>{

        socket.on(CHAT_EVENTS.TYPING,onTyping);

        socket.on(CHAT_EVENTS.STOP_TYPING,onStopTyping);

        socket.on(CHAT_EVENTS.MSG_RECEIVED,onMessageReceived);

        return () => {
            socket.off(CHAT_EVENTS.TYPING,onTyping);

            socket.off(CHAT_EVENTS.STOP_TYPING,onStopTyping);
        
            socket.off(CHAT_EVENTS.MSG_RECEIVED,onMessageReceived);
        }

    },[socket,chatId])

        
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
                                    {myId === m.sender ? "You" : `${m.fullname} . ${m.username}`}
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
            {typing && <Typing/>}
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
                <CommentInput 
                    fullName={myProfile.fullName}
                    avatar={myProfile.avatar}
                    value={newMsg}
                    onChange={handleTyping}
                    handler={sendNewMessage}
                    placeholder="Type new message" 
                />
            </AppBar>
        </>
    )
}