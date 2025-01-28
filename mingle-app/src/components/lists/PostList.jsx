import { postList } from "../../utils/sampleData";
import { useEffect, useState } from "react";
import PostTemplate from '../templates/PostTemplate';
import Loading from '../../utils/Loading.jsx';
import { Button, Typography } from "@mui/material";

export default function PostList({ feed = true, username }) {

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1)

    useEffect(() => {
        
        const getPosts = () => {
            try {
                setPosts(postList)
            } catch (error) {
                
            } finally{
                setLoading(false);
            }
        }
        
        getPosts();
    }, [page, feed, username]);


    if (loading)
        return <Loading color="secondary" size="4rem" />

    return (
        <>
            {
                posts.map((postData) => (
                    <PostTemplate key={postData._id} postData={postData} />
                ))
            }
            <Typography textAlign='center' p={2}>
                <Button 
                    variant="text" 
                    color="secondary"
                    onClick={()=>setPage(page+1)}
                >
                    Load More
                </Button>
            </Typography>
        </>
    )
}