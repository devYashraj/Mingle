import { Box, Avatar, Typography, Button, Stack } from "@mui/material";
import Divider from '@mui/material/Divider';
import { Link } from 'react-router'
import { useNavigate } from "react-router";
import { useState } from "react";
import { useSelector } from "react-redux";
import { formatCount } from "../../utils/formatter";
import { followUnfollowUser } from '../../api/followings.api';

export default function ProfileTemplate({ profileData, small }) {

    const navigate = useNavigate();
    const myProfile = useSelector((state)=>state.auth.userData)

    const {
        _id,
        fullname,
        username,
        email,
        avatar,
        headline,
        biography,
        publicUrls,
        createdAt,
        followersCount,
        followingCount,
        followedByMe
    } = profileData;

    const owner = myProfile.username === username;
    const [follow, setFollow] = useState(followedByMe);
    const [follows, setFollows] = useState(followersCount);

    const handleFollow = async () => {
        try {
            const response = await followUnfollowUser(_id);
            if(response.statuscode === 200){
                const following = response.data.followedByMe
                setFollow(following);
                if(following){
                    setFollows((f)=>f+1)
                }
                else{
                    setFollows((f)=>f-1)
                }
            }
        } 
        catch (error) {
            
        }
    }

    return (
        <>
            <Box className="greyBorder" sx={{ p: 2 }}>
                <Avatar
                    alt={fullname}
                    src={avatar}
                    sx={{ width: 56, height: 56 }}
                />
                <Typography variant="body1" sx={{ mt: 2 }}>
                    {fullname}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    <Link className="tags"
                        to={
                            owner ?
                                `../myprofile/posts` :
                                `../profile/${username}/posts`
                        }>
                        {username}
                    </Link>
                </Typography>
                <Typography variant="body2">
                    {headline}
                </Typography>
                {
                    small ?
                        <Button variant="contained" onClick={() => navigate("../myprofile/posts")} sx={{ mt: 2 }}>View Profile</Button>
                        :
                        <>
                            <Divider />
                            <Typography variant="body1" sx={{ mt: 2 }}>Biography</Typography>
                            <Typography variant="caption">
                                {biography}
                            </Typography>
                            <Typography variant="body1" sx={{ mt: 2 }}>Public Links</Typography>
                            {
                                publicUrls.map((url, i) => (
                                    <Typography key={url} variant="subtitle2" sx={{ color: "text.secondary" }}>
                                        <Link className="tags" to={url}>
                                            {url}
                                        </Link>
                                    </Typography>
                                ))
                            }
                            <Typography variant="subtitle2" sx={{ color: "text.secondary" }}>
                                <Link className="tags" to={`mailto:${email}`}>
                                    {email}
                                </Link>
                            </Typography>
                            <Divider />
                            <Stack sx={{ mt: 2, mb: 3 }} direction="row" spacing={10}>
                                <Button 
                                    variant="text"
                                    color="secondary"
                                    onClick={()=>{
                                        owner ? navigate('../myprofile/followers') : navigate(`../profile/${username}/followers`)
                                    }}
                                >
                                    <Typography variant="body1">
                                        {formatCount(follows) + " "}
                                        <Typography variant="caption">
                                            Followers
                                        </Typography>
                                    </Typography>
                                </Button>
                                <Button
                                    variant="text"
                                    color="secondary"
                                    onClick={()=>{
                                        owner ? navigate('../myprofile/following') : navigate(`../profile/${username}/following`)
                                    }}
                                >
                                    <Typography variant="body1">
                                        {formatCount(followingCount) + " "}
                                        <Typography variant="caption">
                                            Following
                                        </Typography>
                                    </Typography>
                                </Button>
                            </Stack>

                            {
                                owner ?
                                    <Button variant="contained" onClick={() => navigate("../myprofile/edit-profile")}>Edit Profile</Button>
                                    :
                                    <Button
                                        variant={follow ? "outlined" : "contained"}
                                        onClick={handleFollow}
                                    >
                                        {follow ? "Unfollow" : "Follow"}
                                    </Button>
                            }
                        </>
                }
            </Box>
        </>
    )
}