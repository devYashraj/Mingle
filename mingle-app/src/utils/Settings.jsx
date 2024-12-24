import * as React from 'react';
import Box from '@mui/material/Box';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import { themes } from '../utils/themes';
import { useSelector, useDispatch } from 'react-redux';
import { changeTheme } from '../features/theme/themeSlice';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function Settings() {

    const dispatch = useDispatch();
    const initTheme = useSelector(state => state.theme.themeName); 
    const [theme, setTheme] = React.useState(initTheme);
    
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    
    const handleChange = (event) => {
        const newTheme = event.target.value; 
        setTheme(newTheme);
        dispatch(changeTheme(newTheme));
        localStorage.setItem("mingle.theme",newTheme);
    };

    const themeNames = Object.keys(themes);

    return (
        <div>
            <Typography sx={{ textAlign: 'center' }} onClick={handleOpen}>Settings</Typography>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography sx={{ textAlign: 'center' }} id="modal-modal-title" variant="h6" component="h2">
                        Settings
                    </Typography>
                    <Typography component='div' id="modal-modal-description" sx={{ mt: 2 }}>
                        <InputLabel id="demo-simple-select-label">Theme</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={theme}
                            label="theme"
                            onChange={handleChange}
                        >
                            {themeNames.map((i)=>
                                <MenuItem key={i} value={i}>{i}</MenuItem>
                            )}
                        </Select>
                    </Typography>
                </Box>
            </Modal>
        </div>
    );
}
