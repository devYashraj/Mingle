import Grid  from "@mui/material/Grid2";
import { Box } from "@mui/material";

export default function ProfileLayout({ left, right }) {
    return (
        <>
            <Box sx={{m: 1, mt: 2 }}>
                <Grid container spacing={{xs:1,sm:1,md:1}}>
                    <Grid
                        size={{xs:12, sm:12, md:4}}
                        sx={{
                            height: {md: "100vh"},
                            position:{md : "sticky"},
                            overflowY: {md : "auto"},
                            top: {md: "12%"}
                        }}
                    >
                        {left}
                    </Grid>
                    <Grid
                        size={{xs:12, sm:12, md:8}}
                    >
                        {right}
                    </Grid>
                </Grid>
            </Box>
        </>
    )
}