import { Box, Avatar, Typography, Button, Stack } from "@mui/material";
import Divider from '@mui/material/Divider';
import { Link } from 'react-router'
import { useNavigate } from "react-router";
import { useState } from "react";

import { formatCount } from "../../utils/formatter";

import { myProfile } from "../../utils/sampleData";

export default function ProfileTemplate({ profileData, small }) {

    const navigate = useNavigate();

    const handleFollow = () => {
        //follow logic
        console.log("Here");

        alert("Sending follow");
        setFollow(true);
    }

    const handleUnFollow = () => {
        //unfollow logic
        alert("Unfollowing");
        setFollow(false);
    }

    const {
        fullname,
        username,
        email,
        avatar,
        headline,
        biography,
        publicUrls,
        createdAt,
        followers,
        following,
        connected
    } = profileData;

    const owner = myProfile.username === username;
    const [follow, setFollow] = useState(connected);

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
                                <Typography variant="body1">
                                    {formatCount(followers) + " "}
                                    <Typography variant="caption">
                                        Followers
                                    </Typography>
                                </Typography>
                                <Typography variant="body1">
                                    {formatCount(following) + " "}
                                    <Typography variant="caption">
                                        Following
                                    </Typography>
                                </Typography>
                            </Stack>

                            {
                                owner ?
                                    <Button variant="contained" onClick={() => navigate("../myprofile/edit-profile")}>Edit Profile</Button>
                                    :
                                    <Button
                                        variant={follow ? "outlined" : "contained"}
                                        onClick={() =>
                                            follow ? handleUnFollow() : handleFollow()
                                        }
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