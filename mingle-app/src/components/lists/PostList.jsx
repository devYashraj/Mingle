import { postList } from "../../utils/sampleData";
import { useEffect, useState } from "react";
import PostTemplate from '../templates/PostTemplate';
import Loading from '../../utils/Loading.jsx';

export default function PostList({ feed = true, username }) {

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        
        setLoading(true);

        const getPosts = () => {
            setPosts(postList)
            setLoading(false);
        }

        getPosts();
    }, [feed, username]);


    if (loading)
        return <Loading color="secondary" size="4rem" />

    return (
        <>
            {
                posts.map((postData) => (
                    <PostTemplate key={postData._id} postData={postData} />
                ))
            }
        </>
    )
}