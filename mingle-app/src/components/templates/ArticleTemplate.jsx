import { Typography, Box } from "@mui/material"

export default function ArticleTemplate({ article, ...rest }) {
    return (
        <>
            <Box className="article clickable" {...rest}>
                <Typography color="textSecondary">
                    {article}
                </Typography>
            </Box>
        </>
    )
}