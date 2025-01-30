import { List, Container, Typography, Button } from '@mui/material';
import NoData from '../../utils/NoData';
import CommentTemplate from '../templates/CommentTemplate';
import { useState, useEffect } from 'react';
import Loading from '../../utils/Loading';
import { getPostComments } from '../../api/comments.api';

export default function CommentList({postId, refresh}) {    

    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [more, setMore] = useState(false);
    const [page, setPage] = useState(1);
    
    const getComments = async (currentPage) => {
        try {
            const response = await getPostComments(postId,currentPage);
            if(response.statuscode === 200){
                const { docs, hasNextPage} = response.data;
                if(page === 1)
                    setComments(docs);
                else
                    setComments((prevComments)=>[...prevComments, ...docs])

                setMore(hasNextPage);
            }
        } 
        catch (error) {
            
        }
        finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
        getComments(page);
    },[postId,page,refresh]);

    if(loading)
        return <Loading color='secondary' size='2rem'/>

    return (
        <>
            {
                comments.length ?
                    <List className='greyBorder' sx={{ width: '100%' }}>
                        {comments.map((comment, i) => (
                            <Container key={i} sx={{ m: 0, p: 0 }}>
                                <CommentTemplate comment={comment} />
                            </Container>
                        ))}
                    </List>
                    : <NoData textAlign="center" variant="h6" sx={{ m: 2, color: "text.secondary" }} />
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
