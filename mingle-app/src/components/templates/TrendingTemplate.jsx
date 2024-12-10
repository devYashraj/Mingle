import { Box, Typography, Avatar } from '@mui/material';
import { List, ListItem, ListItemText, ListItemAvatar } from '@mui/material';
import { Link, useNavigate } from 'react-router'
import { formatCount } from '../../utils/formatter.js'
import NoData from '../../utils/NoData.jsx';

import { sampleTrendingPosts } from '../../utils/sampleData.js';

export default function TrendingTemplate() {

    const trending = sampleTrendingPosts;

    const { posts, tags } = trending;

    const navigate = useNavigate();

    return (
        <>
            <Box className="greyBorder">
                <Typography variant='h6' textAlign="center">
                    Trending
                </Typography>
                <Box>
                    <Typography variant='body1' m={2}>
                        Posts
                    </Typography>
                    <List className="clickable" sx={{ width: '100%', bgcolor: 'background.paper' }}>
                        {
                            posts.length ?
                                posts.map((post, i) => (
                                    <ListItem key={i}
                                        onClick={() => navigate(`/post/${post.id}`)}
                                        alignItems="flex-start"
                                        sx={{
                                            m: 0, mb: 1, p: 0, pl: 1,
                                            "&:hover": {
                                                bgcolor: 'background.default',
                                                cursor: "pointer"
                                            }
                                        }}
                                    >
                                        <ListItemAvatar>
                                            <Avatar alt={post.fullName} src={post.avatar} />
                                        </ListItemAvatar>
                                        <ListItemText
                                            width="100%"
                                            primary={
                                                <Typography variant='body2'>{post.title}</Typography>
                                            }
                                            secondary={
                                                <>
                                                    <Typography
                                                        variant="caption"
                                                        sx={{ color: 'text.primary' }}
                                                    >
                                                        {post.fullName}
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        sx={{ color: 'text.primary', display: 'block' }}
                                                    >
                                                        {`${formatCount(post.likes)} Likes ${formatCount(post.comments)} Comments`}
                                                    </Typography>
                                                </>
                                            }
                                        />
                                    </ListItem>
                                ))
                                :
                                <NoData textAlign="center" variant='subtitle1'/>
                        }
                    </List>
                    <Typography variant='body1' m={2}>
                        Tags
                    </Typography>
                    <List sx={{ width: '100%', bgcolor: 'background.default' }}>
                        {
                            tags.length ?
                                tags.map((tag, i) => (

                                    <ListItem key={i} sx={{ m: 0, mb: 1, p: 0, pl: 2 }}>
                                        <ListItemText
                                            primary={
                                                <Link className='tags' to={`../tag/${tag}`}>{"#" + tag}</Link>
                                            }
                                        />
                                    </ListItem>
                                )) :
                                <NoData textAlign="center" variant='subtitle1'/>
                        }
                    </List>
                </Box>
            </Box>
        </>
    )
}