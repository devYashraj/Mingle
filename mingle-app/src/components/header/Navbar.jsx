import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople'
import NotificationsIcon from '@mui/icons-material/Notifications';
import SearchIcon from '@mui/icons-material/Search';
import Badge from '@mui/material/Badge';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import ChatIcon from '@mui/icons-material/Chat';
import {useNavigate} from 'react-router'
import { myProfile } from '../../utils/sampleData';
import Settings from '../../utils/Settings';

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '45ch',
            },
        },
    },
}));

const settings = ['My Profile', 'My Network', <Settings/>, 'Logout'];

function handleSearchQuery(e){
    if(e.key === "Enter"){
        alert("Searching something")
    }
}

function Navbar() {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const navigate = useNavigate();
    const [search, setSearch] = React.useState("");

    const handleSearch = (e) =>{
        setSearch(e.target.value);
    }

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleNavigate = (s) => {
        if(s === "My Profile")
            navigate('/myprofile/posts');
        else if(s === "My Network")
            navigate('/mynetwork');
    }

    return (
        <>
            <AppBar position="sticky" enableColorOnDark
                    sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
            >
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        <EmojiPeopleIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                        <Typography
                            variant="h6"
                            noWrap
                            component="a"
                            href="#app-bar-with-responsive-menu"
                            sx={{
                                mr: 2,
                                display: { xs: 'none', md: 'flex' },
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            mingle
                        </Typography>

                        <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                            <IconButton
                                size="large"
                                aria-label="account of current user"
                                aria-controls="menu-appbar"
                                aria-haspopup="true"
                                onClick={() => alert("Input something")}
                                color="inherit"
                            >
                                <SearchIcon />
                            </IconButton>

                        </Box>
                        <EmojiPeopleIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                        <Typography
                            variant="h5"
                            noWrap
                            component="a"
                            href="#app-bar-with-responsive-menu"
                            sx={{
                                mr: 2,
                                display: { xs: 'flex', md: 'none' },
                                flexGrow: 1,
                                fontFamily: 'monospace',
                                fontWeight: 700,
                                letterSpacing: '.3rem',
                                color: 'inherit',
                                textDecoration: 'none',
                            }}
                        >
                            mingle
                        </Typography>
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                            <Search>
                                <SearchIconWrapper>
                                    <SearchIcon />
                                </SearchIconWrapper>
                                <StyledInputBase
                                    placeholder="Search…"
                                    inputProps={{ 'aria-label': 'search' }}
                                    onChange={handleSearch}
                                    value={search}
                                    onKeyDown={handleSearchQuery}
                                />
                            </Search>
                        </Box>
                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Open Chats">
                                <IconButton
                                    onClick={() => alert("Feature under development")}
                                    sx={{ p: 0, mr: 2, color: 'inherit' }}>
                                    <Badge badgeContent={7} color='secondary'>
                                        <ChatIcon fontSize='medium' />
                                    </Badge>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="See Notifications">
                                <IconButton sx={{ p: 0, mr: 2, color: 'inherit' }}>
                                    <Badge badgeContent={7} color='secondary'>
                                        <NotificationsIcon fontSize='medium' />
                                    </Badge>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar
                                        alt={myProfile.fullName}
                                        src={myProfile.avatar}
                                        sx={{
                                            bgcolor: "background.paper",
                                            color: "text.primary"
                                        }}
                                    />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                {settings.map((setting) => (
                                    <MenuItem key={setting} onClick={handleCloseUserMenu}>
                                        <Typography component='div'
                                            sx={{ textAlign: 'center' }} 
                                            onClick={()=>handleNavigate(setting)}
                                        >
                                            {setting}
                                        </Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>
        </>
    );
}
export default Navbar;


