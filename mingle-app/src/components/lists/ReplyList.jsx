import * as React from 'react';
import { List, Container, Typography, Button } from '@mui/material';
import NoData from '../../utils/NoData';
import ReplyTemplate from '../templates/ReplyTemplate'
import { useState, useEffect } from 'react';
import Loading from '../../utils/Loading';

export default function RepliesTemplate({func, refreshId, styles }) {
    
    const [replies, setReplies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [more, setMore] = useState(false);

    const getComments = async (currentPage) =>{
        try {
            setLoading(true);
            const response = await func(currentPage);
            
            if(response.statuscode === 200){
                const {docs, hasNextPage} = response.data;

                if(currentPage === 1){
                    setReplies(docs)
                }
                else{
                    setReplies((prevReplies)=>[...prevReplies,...docs])
                }

                setMore(hasNextPage);
            }
        } catch (error) {
            
        }finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
        getComments(page);
    },[page,refreshId])

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
            <Typography textAlign='center' p={2}>
            {
                more &&
                <Button 
                    variant="text" 
                    color="secondary"
                    onClick={() => setPage((prevPage) => prevPage + 1)}
                >
                    Load More
                </Button>
            }
            </Typography>
        </>
    );
}
