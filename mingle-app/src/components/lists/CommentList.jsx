import { List, Container } from '@mui/material';
import NoData from '../../utils/NoData';
import CommentTemplate from '../templates/CommentTemplate';
import { useState, useEffect } from 'react';
import Loading from '../../utils/Loading';

import { sampleComments } from '../../utils/sampleData';

export default function CommentList({postId}) {    

    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    //fetch comments for postId
    
    useEffect(()=>{
        function getComments() {
            try {  
                const newComments = sampleComments;
                setComments(newComments);
            } catch (error) {
                
            } finally{
                setLoading(false);
            }
        }
        getComments();
    },[postId]);

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
        </>
    );
}
