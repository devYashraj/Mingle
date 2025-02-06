import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { sampleChatList } from '../../utils/sampleData';
import { Badge, Container } from '@mui/material';
import { useNavigate } from 'react-router';
import { useState, useEffect } from 'react';
import { stringAvatar } from "../../utils/commonFunctions.js"

export default function ChatList({unreadMessages, setUnreadMessages}) {

    const navigate = useNavigate();
    const [chatList, setChatList] = useState([])
    

    const getChats = () => {
        try {
            setChatList(sampleChatList)
        } 
        catch (error) 
        {

        }
    }

    useEffect(()=>{
        getChats();
    },[])

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
                                primary={c.name}
                                secondary={
                                    <React.Fragment>
                                        <Typography
                                            component="span"
                                            variant="body2"
                                        >
                                        {c.lastMessage.substring(0,50)+'...'}
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
