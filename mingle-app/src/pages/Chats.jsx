import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import ChatList from '../components/lists/ChatList';
import { Stack } from '@mui/material';
import MessageList from '../components/lists/MessageList.jsx';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import ChatMenu from '../utils/ChatMenu.jsx';
import { useEffect, useState } from 'react';
import NewChatForm from '../components/inputs/NewChatForm.jsx';
import Loading from '../utils/Loading.jsx';
import { getAllChats } from '../api/chats.api.js';
import { CHAT_EVENTS } from '../utils/commonFunctions.js';
import { useSocket } from '../context/SocketContext.jsx';

const drawerWidth = 350;

export default function Chats() {
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const [isClosing, setIsClosing] = React.useState(false);
    const myProfile = useSelector((state) => state.auth.userData);

    const { id } = useParams();

    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    };

    const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
    };

    const handleDrawerToggle = () => {
        if (!isClosing) {
            setMobileOpen(!mobileOpen);
        }
    };

    const SelectChat = () => (
        <>
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
                </Toolbar>
            </AppBar>
            <Toolbar/>
            <Typography variant='h5' textAlign='center'>
                Select a chat to start messaging
            </Typography>
        </>
    )

    const [unreadMessages, setUnreadMessages] = useState([]);
    const [chatList, setChatList] = useState([])
    const [loading, setLoading] = useState(true)
    const socket = useSocket();

    const getChats = async () => {
        try {
            setLoading(true);
            const response = await getAllChats(); 
            setChatList(response.data)
        } 
        catch (error) 
        {

        }
        finally{ 
            setLoading(false);
        }
    }

    const onNewChat = (chat) => {
        setChatList((prev)=>[chat,...prev])
    }

    useEffect(()=>{
        getChats();
    },[])

    useEffect(()=>{

        socket.on(CHAT_EVENTS.NEW_CHAT, onNewChat);

        return () => {
            socket.off(CHAT_EVENTS.NEW_CHAT,onNewChat);
        }
    },[socket])

    if(loading)
        return <Loading color='secondary' size="2rem"/>

    const drawer = (
        <div>
            <Toolbar />
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant='h6' pl={4}>Chats</Typography>
                <Stack direction='row' spacing={1}>
                    <NewChatForm setChatList={setChatList}/>
                    <ChatMenu/>
                </Stack>
            </Box>
            <Divider />
            <ChatList 
                chatList={chatList}
                myUsername={myProfile.username}
                unreadMessages={unreadMessages}
            />
        </div>
    );


    return (
        <Box sx={{ display: 'flex' }}>
        
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                <Drawer
                    variant="temporary"
                    open={mobileOpen}
                    onTransitionEnd={handleDrawerTransitionEnd}
                    onClose={handleDrawerClose}
                    ModalProps={{
                        keepMounted: true,
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box
                component="main"
                sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
            >
                {
                    (!id) ?
                        <SelectChat /> :
                        <MessageList
                            unreadMessages={unreadMessages}
                            setUnreadMessages={setUnreadMessages}
                            myProfile={myProfile}
                            chatId={id}
                            drawerWidth={drawerWidth}
                            handleDrawerToggle={handleDrawerToggle}
                        />
                }
            </Box>
        </Box>
    );
}

