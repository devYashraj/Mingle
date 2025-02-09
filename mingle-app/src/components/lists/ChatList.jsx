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
import { stringAvatar, getChatName } from "../../utils/commonFunctions.js"
import { getFullDate } from '../../utils/formatter.js';

export default function ChatList({chatList, myUsername, unreadMessages}) {

    const navigate = useNavigate();

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
                                    badgeContent={unreadMessages.filter((m)=>m.chat===c._id).length} 
                                    color='secondary'
                                />
                            }
                        >
                            <ListItemAvatar>
                                <Avatar {...stringAvatar(getChatName(c,myUsername))} variant='square'/>
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <>
                                        <Typography variant='h6'>
                                            {getChatName(c,myUsername)}
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
