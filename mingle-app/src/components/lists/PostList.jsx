import { useEffect, useState } from "react";
import PostTemplate from '../templates/PostTemplate';
import Loading from '../../utils/Loading.jsx';
import { Button, Typography } from "@mui/material";
import NoData from '../../utils/NoData.jsx';
import { useSelector } from "react-redux";

export default function PostList({ func, refreshId }) {

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1)
    const [more, setMore] = useState(false);
    const myProfile = useSelector((state)=>state.auth.userData);

    const getPosts = async (currentPage) => {
        try {
            setLoading(true);
            const response = await func(currentPage);
            if(response.statuscode === 200){
                const {docs, hasNextPage} = response.data;
                
                if(currentPage === 1){
                    setPosts([...docs]);
                }
                else {
                    setPosts((prevPosts)=>[...prevPosts, ...docs]);
                }
                setMore(hasNextPage);
            }
            
        } catch (error) {
            
        } finally{
            setLoading(false);
        }
    }

    useEffect(()=>{
        getPosts(page);
    },[page,refreshId])


    if (loading)
        return <Loading color="secondary" size="4rem" />

    if(posts.length === 0){
        return <NoData textAlign="center" variant="h6" p={2}/>
    }

    return (
        <>
            <div className="post-list">
            {   
                posts.map((postData) => (
                    <PostTemplate key={postData._id} postData={postData} myProfile={myProfile}/>
                ))
            }
            </div>
            <Typography textAlign='center' p={2}>
            {
                more &&
                <Button 
                    variant="text" 
                    color="secondary"
                    onClick={() => setPage((prevPage) => prevPage + 1)}
                >
                    Load More
                </Button>
            }
            </Typography>
        </>
    )
}