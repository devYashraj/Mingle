import AddIcon from '@mui/icons-material/Add';
import {Container, Tooltip, Fab } from '@mui/material';

export default function CreateNewButton(props) {
    return (
        <>
            <Container>
                <Tooltip title="Create New">
                    <Fab
                        {...props}
                        aria-label="add"
                        sx={{
                            position: "fixed",
                            bottom: 16,
                            right: 16
                        }}
                    >
                        <AddIcon />
                    </Fab>
                </Tooltip>
            </Container>
        </>
    )
}