import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate, createSearchParams } from 'react-router';

export default function SearchInput() {

    const [open, setOpen] = React.useState(false);
    const navigate = useNavigate();

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <React.Fragment>
            <IconButton
                size="large"
                onClick={handleClickOpen}
                color="inherit"
            >
                <SearchIcon />
            </IconButton>
            <Dialog
                open={open}
                onClose={handleClose}
                PaperProps={{
                    component: 'form',
                    onSubmit: (event) => {
                        event.preventDefault();
                        const formData = new FormData(event.currentTarget);
                        const formJson = Object.fromEntries(formData.entries());
                        const searchQuery = formJson.searchQuery;
                        handleClose();
                        navigate({
                            pathname: "/search",
                            search: createSearchParams({
                                    search: searchQuery
                                }).toString()
                            
                        })
                    },
                }}
            >
                <DialogContent>
                    <TextField
                        margin="dense"
                        id="name"
                        name="searchQuery"
                        label="Search..."
                        fullWidth
                        variant="standard"
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button type="submit">Search</Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    );
}
