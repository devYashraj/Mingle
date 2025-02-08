import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Badge, Container } from '@mui/material';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { stringAvatar } from "../../utils/commonFunctions.js"
import { getAllChats } from '../../api/chats.api.js';
import Loading from '../../utils/Loading.jsx';
import { getFullDate } from '../../utils/formatter.js';

export default function ChatList({myUsername, unreadMessages, setUnreadMessages}) {

    const navigate = useNavigate();
    const [chatList, setChatList] = useState([])
    const [loading, setLoading] = useState(true)

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

    useEffect(()=>{
        getChats();
    },[])

    const getChatName = (chat) => {
        if(chat.isGroupChat){
            return chat.name
        }
        const otherMember = chat.participants.filter((m)=>m.username !== myUsername)
        return otherMember[0].fullname;
    }

    if(loading)
        return <Loading color='secondary'/>

    return (
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {
                chatList.map((c) => (
                    <Container 
                        key={c._id} 
                        className='clickable'
                        sx={{
                            '&:hover': { 
                                backgroundColor: 'background.default', 
                            }
                        }}
                        onClick={()=>
                            navigate(`/chats/${c._id}`)}
                    >
                        <ListItem 
                            alignItems="flex-start" 
                            secondaryAction={
                                <Badge 
                                    badgeContent={unreadMessages.length} 
                                    color='secondary'
                                />
                            }
                        >
                            <ListItemAvatar>
                                <Avatar {...stringAvatar(c.name)} variant='square'/>
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <>
                                        <Typography variant='h6'>
                                            {getChatName(c)}
                                        </Typography>
                                    </>
                                }
                                secondary={
                                    <React.Fragment>
                                        
                                        <Typography
                                            component="span"
                                            variant="body2"
                                        >
                                            {c.lastMessage ? c.lastMessage.substring(0,50)+'...' : ''}
                                        </Typography>
                                        <br/>
                                        <Typography variant='overline'>
                                            {`${getFullDate(c.updatedAt)}`}
                                        </Typography>
                                    </React.Fragment>
                                }
                            />
                        </ListItem>
                        <Divider variant="inset" component="li" />
                    </Container>
                ))
            }
        </List>
    );
}
