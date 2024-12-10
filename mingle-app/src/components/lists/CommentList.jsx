import { List, Container } from '@mui/material';
import NoData from '../../utils/NoData';

import CommentTemplate from '../templates/CommentTemplate';
import { useState, useEffect } from 'react';

import { sampleComments } from '../../utils/sampleData';

export default function CommentList({postId, userId}) {    

    const [comments, setComments] = useState([]);
    
    useEffect(()=>{
        function getComments() {
            
            const newComments = sampleComments;
            setComments(newComments);
        }
        getComments();
    },[]);

    return (
        <>
            {
                comments.length ?
                    <List className='greyBorder' sx={{ width: '100%' }}>
                        {comments.map((comment, i) => (
                            <Container key={i} sx={{ m: 0, p: 0 }}>
                                <CommentTemplate postId={postId} userId={userId} comment={comment} />
                            </Container>
                        ))}
                    </List>
                    : <NoData textAlign="center" variant="h6" sx={{ m: 2, color: "text.secondary" }} />
            }
        </>
    );
}
