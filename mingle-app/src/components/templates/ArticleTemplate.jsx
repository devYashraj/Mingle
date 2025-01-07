import { Typography, Box } from "@mui/material"

export default function ArticleTemplate({ article, ...rest }) {

    const htmlString = article;
    const theObj = {__html:htmlString};
    return (
        <>
            <Box className="article clickable" {...rest}>
                <Typography color="textSecondary" component='div'>
                    <div dangerouslySetInnerHTML={theObj}/>
                </Typography>
            </Box>
        </>
    )
}