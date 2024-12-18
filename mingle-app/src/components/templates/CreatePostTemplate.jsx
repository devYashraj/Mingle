import { Box, Typography, Button } from '@mui/material';
import { TextField, Select, MenuItem } from '@mui/material';
import { useState } from 'react';

export default function CreatePostTemplate() {

    const [postType, setPostType] = useState('article');

    return (
        <>
            <Box className='greyBorder' sx={{ bgcolor: 'background.paper' }}>
                <Typography variant='h6' sx={{ p: 2, textAlign:'center' }}>
                    Create Post
                </Typography>
                <TextField
                    variant='outlined'
                    fullWidth
                    placeholder='Title*'
                    sx={{ p: 2 }}
                />
                <TextField
                    variant='outlined'
                    fullWidth
                    placeholder='Tags'
                    sx={{ p: 2 }}
                />
                <Select
                    className='createFields'
                    defaultValue='article'
                    value={postType}
                    onChange={(e) => setPostType(e.target.value)}
                    sx={{ m: 2, borderRadius: "30px" }}
                >
                    <MenuItem value='article'>Article</MenuItem>
                    <MenuItem value='image'>Image</MenuItem>
                    <MenuItem value='video'>Video</MenuItem>
                </Select>
                {
                    //add a rich text editor here
                    postType === 'article' &&
                    <TextField
                        className='createFields'
                        variant='outlined'
                        fullWidth
                        placeholder='Start writing here...*'
                        multiline
                        sx={{ p: 2 }}
                    />
                    
                }
                {
                    postType !== 'article' &&
                    <Box textAlign='center'>
                        <Button variant='outlined' color='secondary'>
                            {`Upload ${postType.toUpperCase()}`}
                        </Button>
                    </Box>
                }
                {
                    postType !== 'article' &&
                    <TextField
                        className='createFields'
                        variant='outlined'
                        fullWidth
                        placeholder='Description'
                        multiline
                        sx={{ p: 2 }}
                    />
                }
                <Box textAlign='center' sx={{m:2}}>
                    <Button variant='contained' color='primary' sx={{borderRadius:"30px"}}>
                        Post
                    </Button>
                </Box>
            </Box>
        </>
    )
}