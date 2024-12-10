import * as React from 'react';
import { List, Container } from '@mui/material';
import NoData from '../../utils/NoData';
import ReplyTemplate from '../templates/ReplyTemplate'


import { sampleComments as comments } from '../../utils/sampleData';

export default function RepliesTemplate({ styles }) {
    const replies = comments;
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
