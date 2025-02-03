import * as React from 'react';
import { useState, useEffect } from 'react';
import Loading from '../../utils/Loading'
import { Container } from '@mui/material';
import UserListItemTemplate from '../templates/UserListItemTemplate';
import { List } from '@mui/material';
import { useSelector } from 'react-redux';
import NoData from '../../utils/NoData';

export default function UserList({ func, refreshId }) {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const myProfile = useSelector((state)=>state.auth.userData);

    const getUserList = async (currentPage) => {
        try {
            setLoading(true);
            const response = await func(currentPage);
            if (response.statuscode === 200) {
                const { docs, hasNextPage } = response.data;
                if (currentPage === 1)
                    setUsers([...docs])
                else
                    setUsers((prev) => [...prev, ...docs])
            }
        }
        catch (error) {

        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        getUserList(page);
    }, [page, refreshId])

    if (loading) {
        return <Loading />
    }

    if(users.length === 0){
        return <NoData textAlign="center" variant="h6" p={2}/>
    }
    return (
        <>
            <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
                {users.map((u,i) => (
                    <Container key={i}>
                        <UserListItemTemplate u={u} myProfile={myProfile}/>
                    </Container>
                ))}
            </List>
        </>
    );
}
