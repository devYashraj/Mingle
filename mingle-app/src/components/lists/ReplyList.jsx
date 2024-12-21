import * as React from 'react';
import { List, Container } from '@mui/material';
import NoData from '../../utils/NoData';
import ReplyTemplate from '../templates/ReplyTemplate'
import { useState, useEffect } from 'react';
import Loading from '../../utils/Loading';

import { sampleComments as comments } from '../../utils/sampleData';

export default function RepliesTemplate({self=false, username, commentId, styles }) {
    //if self=true get self comments else of username
    //if commentId=true get replies to commentId;
    const [replies, setReplies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const getComments = () =>{
            try {
                const newComments = comments;
                setReplies(newComments);
            } catch (error) {
                
            }finally{
                setLoading(false);
            }
        }
        getComments();
    },[self,username,commentId])

    if(loading)
        return <Loading color="secondary" size="2rem" />

    return (
        <>
            {
                replies.length ?
                    <List className='greyBorder' sx={{ width: '100%', ...styles }}>
                        {replies.map((reply, i) => (
                            <Container key={i} sx={{ m: 0, p: 0 }}>
                                <ReplyTemplate reply={reply} />
                            </Container>
                        ))}
                    </List>
                    :
                    <NoData textAlign="center" variant="subtitle1" />
            }
        </>
    );
}
