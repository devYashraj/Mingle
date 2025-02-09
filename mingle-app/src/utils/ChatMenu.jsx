import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router';
import { IconButton } from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { logout as userLogout } from '../api/users.api';
import { useDispatch } from 'react-redux';
import { Tooltip } from '@mui/material';
import Settings from './Settings';
import { logout as authLogout } from '../features/auth/authSlice.js';

export default function ChatMenu() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        try {
            const response = await userLogout();
            if (response.statuscode === 200) {
                dispatch(authLogout())
                navigate('/login')
            }
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <div>
            <Tooltip title="More">
                <IconButton
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                >
                    <MoreVertIcon />
                </IconButton>
            </Tooltip>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={() => navigate('/myprofile/posts')}>My Profile</MenuItem>
                <MenuItem onClick={() => navigate('/')}>Home Page</MenuItem>
                <MenuItem><Settings/></MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu> 
        </div>
    );
}
