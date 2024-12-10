import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';

export default function FeedLayout({ left, middle, right }) {
    return (
        <Box sx={{ flexGrow: 1, m: 1, mt: 2 }}>
            <Grid container spacing={{ xs: 1, md: 1 }}>
                <Grid
                    className="fixed"
                    size={{ sm: 4, md: 3 }}
                    sx={{
                        display: { xs: "none", sm: "block", md: "block" },
                    }}
                >
                    <Box
                        maxWidth="100%"
                    >
                        {left}
                    </Box>
                </Grid>
                <Grid
                    size={{ xs: 12, sm: 8, md: 6 }}
                >
                    <Box
                        maxWidth="100%"
                    >
                        {middle}
                    </Box>
                </Grid>
                <Grid
                    className="fixed"
                    size={{ md: 3 }}
                    sx={{
                        display: { xs: "none", sm: "none", md: "block" },
                    }}
                >
                    <Box
                        maxWidth="100%"
                    >
                        {right}
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}
