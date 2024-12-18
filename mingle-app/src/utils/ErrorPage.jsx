import { Box, Typography } from "@mui/material";
import { Link, useRouteError } from "react-router";

export default function ErrorPage() {

    const error = useRouteError();

    return (
        <>
            <Box className="centered">
                <Typography variant="h1">OOPS!</Typography>
                <Typography variant="h3">An unexpected error occurred.</Typography>
                <Typography variant="h4">
                    <i>{error.statusText || error.message}</i>
                </Typography>
                <Typography variant="h5">
                    Go to <Link className="redirect" to='/feed'>Home Page</Link>
                </Typography>
            </Box>
        </>
    )
}