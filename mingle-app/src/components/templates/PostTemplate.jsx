import * as React from 'react';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import { Link, useNavigate } from 'react-router';
import { useDispatch } from 'react-redux'
import { setErrorAlert, setSuccessAlert } from '../../features/alert/alertSlice';

import LikeButton from '../buttons/LikeButton';
import CommentButton from '../buttons/CommentButton';
import SaveButton from '../buttons/SaveButton';
import ShareButton from '../buttons/ShareButton';
import DeleteConfirmation from '../alerts/DeleteConfirmation';

import { formatDate } from '../../utils/formatter';

import ImageTemplate from './ImageTemplate';
import ArticleTemplate from './ArticleTemplate';
import VideoTemplate from './VideoTemplate';

import { savePost, deletePost } from '../../api/posts.api';
import { likeUnlikePost } from '../../api/likes.api';

export default function PostTemplate({ postData, myProfile }) {

    const navigate = useNavigate();

    const {
        _id,
        fullName,
        username,
        title,
        type,
        article,
        mediafiles,
        description,
        tags,
        createdAt,
        avatar,
        liked,
        likesCount,
        commentsCount,
        saved
    } = postData;

    const [like, setLike] = React.useState(liked);
    const [likes, setLikes] = React.useState(likesCount);
    const [save, setSave] = React.useState(saved);
     
    const owner = myProfile.username === username;
    const dispatch = useDispatch();

    const handleSave = async () => {
        try {
            const response = await savePost(_id);
            if(response.statuscode === 201){
                setSave(true)
            }
            else if(response.statuscode === 200) {
                setSave(false);
            }
            
        } catch (error) {
            dispatch(setErrorAlert(error?.response?.data?.message))
        }
    }
    
    const handleLike = async () => {
        try {
            const response = await likeUnlikePost(_id);
            if(response.statuscode === 200){
                const { liked } = response.data;
                if(liked){
                    setLike(true);
                    setLikes((like)=>like+1);
                }
                else{
                    setLike(false);
                    setLikes((like)=>like-1);
                }
            }
            
        } catch (error) {
            console.log(error);
            
            dispatch(setErrorAlert(error?.response?.data?.message))
        }
    }

    const handleDelete = async () => {
        try {
            const response = await deletePost(postData._id);
            if(response.statuscode === 200){
                dispatch(setSuccessAlert("Post deleted successfully"))
            }
        } 
        catch (error) {
            
        }
    }

    const handleRedirect = () => {
        navigate(`/post/${_id}`);
    }

    return (
        <Card sx={{ background: "none" }} className='greyBorder post'>
            <CardHeader
                avatar={
                    <Avatar
                        alt={postData.fullName}
                        src={avatar}
                    />
                }
                action={
                    owner && <DeleteConfirmation deleteInstance={handleDelete}/>
                  }
                title={
                    <Link
                        to={
                            username === myProfile.username ? `/myprofile/posts` : `/profile/${username}/posts`
                        }
                        className='tags'
                    >
                        {fullName}
                    </Link>
                }
                subheader={formatDate(createdAt)}
            />
            <CardContent>
                <Typography className='clickable' onClick={handleRedirect} variant="body1" sx={{ color: 'text' }}>
                    {title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {tags.map((tag, i) => (
                        <Link key={i} to={`../tag/${tag.substring(1)}`} className='tags'>
                            {'#' + tag + " "}
                        </Link>
                    ))}
                </Typography>
            </CardContent>
            <CardMedia>
                {
                    type === "image" &&
                    <ImageTemplate imgList={mediafiles} />
                }
                {
                    type === "article" &&
                    <ArticleTemplate article={article} onClick={handleRedirect}/>
                }
                {
                    type === "video" &&
                    <VideoTemplate urlList={mediafiles}/>
                }
            </CardMedia>
            {description !== null &&
                <CardContent onClick={handleRedirect} className='clickable'>
                    <Typography color='textSecondary'>
                        {description}
                    </Typography>
                </CardContent>
            }
            <CardActions sx={{ justifyContent: "space-between" }} className='notClickable'>
                <Box sx={{ textAlign: "left" }}>

                    <LikeButton
                        liked={like}
                        likesCount={likes}
                        onClick={handleLike}
                    />

                    <CommentButton
                        commentsCount={commentsCount}
                        onClick={()=>navigate(`/post/${_id}`)}
                    />

                </Box>
                <Box>
                    <ShareButton/>
                    <SaveButton saved={save} onClick={handleSave}/>
                </Box>
            </CardActions>
        </Card>
    );
}
