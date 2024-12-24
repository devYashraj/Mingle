import { Box, Typography } from "@mui/material";
import { Link } from "react-router";

export default function ErrorPage() {

    return (
        <>
            <Box className="centered">
                <Typography variant="h1">OOPS!</Typography>
                <Typography variant="h3">404. Page Not Found</Typography>
                <Typography variant="h5" sx={{m:2}}>
                    Go to <Link className="redirect" to='/feed'>Home Page</Link>
                </Typography>
            </Box>
        </>
    )
}