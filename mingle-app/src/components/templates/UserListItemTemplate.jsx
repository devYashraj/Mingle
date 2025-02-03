import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Button } from '@mui/material';
import { useState } from 'react';
import { followUnfollowUser } from '../../api/followings.api';

export default function UserListItemTemplate({u, myProfile}) {

    const [follow, setFollow] = useState(u.followedByMe);
    
    const handleFollow = async () => {
        try {
            const response = await followUnfollowUser(u.userId);
            if(response.statuscode === 200){
                const following = response.data.followedByMe
                setFollow(following);
            }
        } 
        catch (error) {
            
        }
    }

    return (
        <>
            <ListItem
                alignItems="flex-start"
                secondaryAction={
                    <Button
                        variant={follow ? "outlined" : "contained"}
                        onClick={handleFollow}
                        disabled={myProfile.username === u.username}
                    >
                        {follow ? "Unfollow" : "Follow"}
                    </Button>
                }
            >
                <ListItemAvatar>
                    <Avatar alt={u.fullname} src={u.avatar} sx={{ width: 44, height: 44 }} />
                </ListItemAvatar>
                <ListItemText
                    primary={
                        <Typography component="div" variant='h6'>
                            {u.fullname}
                            <Typography variant='subtitle2' className='tags'>
                                {u.username}
                            </Typography>
                        </Typography>
                    }
                    secondary={
                        <Typography component="span" variant='caption' color='text.primary' className='comment'>
                            {u.headline}
                        </Typography>
                    }
                />
            </ListItem>
        </>
    )
}