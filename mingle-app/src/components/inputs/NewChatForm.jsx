import * as React from 'react';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import AddCommentIcon from '@mui/icons-material/AddComment';
import { IconButton, Button, Tooltip, Stack } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import UserSearch from './UserSearch';
import { useState } from 'react';
import BasicAlert from '../alerts/BasicAlert';
import { createNewChat } from '../../api/chats.api.js';
import { useNavigate } from 'react-router';

export default function FormDialog() {
    const [open, setOpen] = React.useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [alertMsg, setAlertMsg] = useState("");
    const [alertOpen, setAlertOpen] = useState(false);
    const navigate = useNavigate();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <React.Fragment>
            <Tooltip title="New Chat">
                <IconButton onClick={handleClickOpen}>
                    <AddCommentIcon />
                </IconButton>
            </Tooltip>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: async (event) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJsonData = Object.fromEntries(formData.entries());
                        formJsonData.members = selectedUsers;

                        if (formJsonData.name.trim() === "") {
                            setAlertMsg("Chat name is required");
                            setAlertOpen(true);
                            return;
                        }

                        if (formJsonData.members.length === 0) {
                            setAlertMsg("Chat Members are required");
                            setAlertOpen(true);
                            return;
                        }
                        if(!formJsonData.isGroupChat){
                            if(selectedUsers.length > 1)
                            {
                                setAlertMsg("Make it a group chat to allow more that 1 members");
                                setAlertOpen(true);
                                return;   
                            }
                        }
                        
                        try {
                            const response = await createNewChat(formJsonData);  
                            if(response.statuscode === 201){
                                const {_id} = response.data;
                                navigate(`/chats/${_id}`)                                
                            }
                        } 
                        catch (error) {
                            setAlertMsg("Chat Creation Failed");
                            setAlertOpen(true);
                        }
                        setSelectedUsers([]);
                        handleClose();
                    },
                }}
            >
                <DialogTitle>New Chat</DialogTitle>
                <DialogContent>
                    <Stack direction='column' spacing={2}>
                        <FormControlLabel
                            control={<Switch name='isGroupChat' />}
                            label="Group Chat?"

                        />
                        <TextField
                            name="name"
                            label="Chat Name"
                            fullWidth
                            variant="outlined"
                        />
                        <UserSearch selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color='secondary'>Cancel</Button>
                    <Button type="submit" variant='outlined' color='primary'>Create</Button>
                </DialogActions>
            </Dialog>
            <BasicAlert
                message={alertMsg}
                open={alertOpen}
                setOpen={setAlertOpen}
                severity='error'
            />
        </React.Fragment>
    );
}
