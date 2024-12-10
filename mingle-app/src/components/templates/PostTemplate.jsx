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

import LikeButton from '../buttons/LikeButton';
import CommentButton from '../buttons/CommentButton';
import SaveButton from '../buttons/SaveButton';
import ShareButton from '../buttons/ShareButton';
import DeleteButton from '../buttons/DeleteButton';

import { formatDate } from '../../utils/formatter';
import { myProfile } from '../../utils/sampleData';

import ImageTemplate from './ImageTemplate';
import ArticleTemplate from './ArticleTemplate';

export default function PostTemplate({ postData }) {

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
    const [save, setSave] = React.useState(saved);
    
    //get data from redux state
    const owner = false;

    const handleSave = () => {
        setSave(!save);
    }
    
    const handleLike = () => {
        setLike(!like);
    }

    const handleDelete = () => {

    }

    const handleRedirect = () => {
        navigate(`/post/${_id}`);
    }

    return (
        <Card sx={{ background: "none" }} className='greyBorder'>
            <CardHeader
                avatar={
                    <Avatar
                        alt={postData.fullName}
                        src={avatar}
                    />
                }
                action={
                    owner && <DeleteButton onClick={handleDelete}/>
                  }
                title={
                    <Link
                        to={
                            username === myProfile.username ? `/myprofile` : `/profile/${username}`
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
                            {tag + " "}
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
                        likesCount={likesCount}
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
