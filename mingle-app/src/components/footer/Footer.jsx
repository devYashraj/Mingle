import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

export default function Footer() {
    return (
        <Typography
            variant="body2"
            align="center"
            sx={{
                color: "text.secondary",
                marginTop: "50px",
                marginBottom: "25px"
            }}
        >
            {'Copyright © '}
            < Link color="inherit" href="https://mui.com/" >
                mingle
            </Link > {' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography >
    );
}