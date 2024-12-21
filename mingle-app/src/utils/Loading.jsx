import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

export default function Loading(props) {
    return (
        <>
            <Box 
                component="span" 
                width="100%"
                className='centered'
            >
                <CircularProgress {...props} />
            </Box>
        </>
    )
}