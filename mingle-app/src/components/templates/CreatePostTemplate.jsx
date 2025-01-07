import { Box, Typography, Button, Stack, Chip, Container, Alert } from '@mui/material';
import { TextField, Select, MenuItem, InputAdornment, IconButton, Collapse } from '@mui/material';
import TagIcon from '@mui/icons-material/Tag';
import SendIcon from '@mui/icons-material/Send';
import { useState } from 'react';
import { VisuallyHiddenInput } from '../../utils/commonFunctions';
import RichTextEditor from '../../utils/RichTextEditor';
import { getFileExtension, urlGenerator} from '../../utils/commonFunctions'
import ImageTemplate from './ImageTemplate'
import VideoTemplate from './VideoTemplate'


export default function CreatePostTemplate() {
    
    const [data, setData] = useState({
        title:"",
        tags:['mingle'],
        description:""
    })
    const [newTag, setNewTag] = useState("");
    const [postType, setPostType] = useState('article');
    const [content, setContent] = useState('<p>Start writing here...</p>');
    const [mediaFiles, setMediaFiles] = useState(null);
    const [titleError, setTitleError] = useState(false);
    const [error, setError] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    
    const handleChange = (evt) =>{
        const name = evt.target.name;
        const val = evt.target.value;
        setData({...data, [name]:val})
    }

    const handleTagDelete = (i) =>{
        const newTags = data.tags.filter((t,ind)=>{
            if(ind == i)
                return false;
            else
                return true;
        })
        setData({...data, tags:newTags})
    }

    const addNewTag = (t) => {
        t = t.trim();
        if(t && data.tags.length < 10)
        {
            t = t[0] === '#' ? t.substr(1) : t;
            const newTags = data.tags;
            newTags.push(t);
            setData({...data, tags:newTags});
            setNewTag('');
        }
    }

    const handleSubmit = (event) =>{
        event.preventDefault();
        
        if(data.title.trim().length === 0)
        {
            setTitleError(true);
            return;
        }
        else if(titleError === true)
            setTitleError(false);
    
        if(postType !== 'article' && (!mediaFiles || mediaFiles?.length === 0))
        {
            setErrorMsg("No File Selected!");
            setError(true);
            return;
        }
        else if(postType === 'image' && mediaFiles.length > 4)
        {
            setErrorMsg("Only 4 images allowed!");
            setError(true);
            return;
        }
        else
        {
            if(postType === 'image')
            {
                for(const file of mediaFiles)
                {
                    if(!(['jpg', 'jpeg', 'png', 'webp'].includes(getFileExtension(file.name))))
                    {
                        setErrorMsg("Invalid Image file!");
                        setError(true);
                        return;
                    }
                    if(file.size > 1048576) //1MB
                    {
                        setErrorMsg("Image size must not exceed 1MB!");
                        setError(true);
                        return;
                    }
                }
            }
            else if(postType === 'video')
            {
                const file = mediaFiles[0];
                if(getFileExtension(file.name) !== 'mp4')
                {
                    setErrorMsg("Invalid Video file");
                    setError(true);
                    return;
                }
                if(file.size > 5242880) //5MB
                {
                    setErrorMsg("Video size must not exceed 5MB!");
                    setError(true);
                    return;
                }
            }
            else
            {
                if(content === '<p></p>' || content === '<pre><code></code></pre>'){
                    setErrorMsg('Article is Empty!');
                    setError(true);
                    return;
                }
                if(content.length > 3000)
                {
                    setErrorMsg('Article is too large!');
                    setError(true);
                    return;
                }
            }
        }

        setError(false);
        setErrorMsg("");
        const formData = new FormData();
        formData.append('title',data.title);
        formData.append('tags',data.tags);
        formData.append('postType',postType);
        formData.append('file',mediaFiles);
        formData.append('content',content);
        formData.append('description',data.description);
        //send formData to backend

    }

    return (
        <>
            <Box component='form' onSubmit={handleSubmit} className='greyBorder' sx={{ bgcolor: 'background.paper' }}>
                <Typography variant='h6' sx={{ p: 2, textAlign:'center' }}>
                    Create Post
                </Typography>
                <TextField
                    variant='outlined'
                    fullWidth
                    name='title'
                    error={titleError}
                    value={data.title}
                    onChange={handleChange}
                    placeholder='Title*'
                    sx={{ p: 2 }}
                />
                <Container>
                    <Stack
                        spacing={{ xs: 1, sm: 2 }}
                        direction="row"
                        useFlexGap
                        sx={{ flexWrap: 'wrap' }}
                    >
                        {
                            data.tags.map((t,i)=>(
                                <Chip 
                                    key={i} 
                                    label={`#${t}`} 
                                    color='secondary'
                                    variant='outlined'
                                    onDelete={()=>handleTagDelete(i)}
                                />
                            ))
                        }
                    </Stack>
                </Container>
                <TextField
                    variant='outlined'
                    fullWidth
                    value={newTag}
                    onChange={(e)=>setNewTag(e.target.value)}
                    placeholder='Add Tags'
                    sx={{ p: 2 }}
                    onKeyDown={(e)=>{
                        if(e.key === "Enter"){
                            e.preventDefault()
                            addNewTag(newTag)
                        }
                    }}
                    slotProps={{
                        input: {
                            startAdornment:
                                <InputAdornment position="start">
                                    <TagIcon />
                                </InputAdornment>,
                            endAdornment:
                                <InputAdornment position='end'>
                                    <IconButton
                                        color='secondary'
                                        onClick={()=>addNewTag(newTag)}
                                    >
                                        <SendIcon fontSize='small'/>
                                    </IconButton>
                                </InputAdornment>
                        }
                    }}
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
                <Collapse in={error}>
                    <Container sx={{p:1}}>
                            <Alert onClose={()=>setError(false)} severity='error'>
                                {errorMsg}
                            </Alert>
                    </Container>
                </Collapse>
                {
                    postType === 'article' &&
                    <RichTextEditor
                        content={content}
                        setContent={setContent}
                    />
                    
                }
                {
                    postType !== 'article' &&
                    <Box textAlign='center'>
                        <Button component='label' tabIndex={-1} variant='outlined' color='secondary'>
                            {`Upload ${postType.toUpperCase()}`}
                            <VisuallyHiddenInput
                                type='file'
                                multiple={postType === "image" ? true : false}
                                onChange={(e)=>{
                                    setMediaFiles(e.target.files)
                                }}
                                accept={postType === 'image' ? 'image/*' : 'video/*'}
                            />
                        </Button>
                    </Box>
                }
                {
                    postType === 'image' && mediaFiles && mediaFiles?.length !== 0 &&
                    <ImageTemplate imgList={urlGenerator(mediaFiles)}/>
                }
                {
                    postType === 'video' && mediaFiles && mediaFiles?.length !== 0 &&
                    <VideoTemplate urlList={urlGenerator(mediaFiles)}/>
                }
                {
                    postType !== 'article' &&
                    <TextField
                        className='createFields'
                        variant='outlined'
                        fullWidth
                        name='description'
                        value={data.description}
                        onChange={handleChange}
                        placeholder='Description'
                        multiline
                        sx={{ p: 2 }}
                    />
                }
                <Box textAlign='center' sx={{m:2}}>
                    <Button type='submit' variant='contained' color='primary' sx={{borderRadius:"30px"}}>
                        Share
                    </Button>
                </Box>
            </Box>
        </>
    )
}