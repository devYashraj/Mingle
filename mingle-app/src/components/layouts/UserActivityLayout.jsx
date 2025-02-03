import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Link, matchPath, useLocation } from 'react-router';
import { useParams } from 'react-router';

import ReplyList from '../lists/ReplyList';
import PostList from '../lists/PostList';
import UserList from '../lists/UserList';
import EditProfileTemplate from '../templates/EditProfileTemplate';
import ChangePassword from '../templates/ChangePassword';
import { useSelector } from 'react-redux';
import { 
    getPostsByUsername, 
    getLikedPosts, 
    getSavedPosts 
} from '../../api/posts.api';
import {
    getCommentsByUsername,
    getLikedComments
} from '../../api/comments.api';
import {
    getFollowers,
    getFollowings
} from '../../api/followings.api'

function useRouteMatch(patterns) {
    const { pathname } = useLocation();

    for (let i = 0; i < patterns.length; i += 1) {
        const pattern = patterns[i];
        const possibleMatch = matchPath(pattern, pathname);
        if (possibleMatch !== null) {
            return possibleMatch;
        }
    }

    return null;
}

export default function UserActivityLayout({ self = true, username }) {

    const { action } = useParams();
    const myprofile = useSelector((state)=>state.auth.userData);
    const refreshId = crypto.randomUUID();

    const tabListPrivate = [
        {
            label: "Posts",
            value: "/myprofile/posts",
        },
        {
            label: "Comments",
            value: "/myprofile/comments",
        },
        {
            label: "Liked Posts",
            value: "/myprofile/liked-posts",
        },
        {
            label: "Liked Comments",
            value: "/myprofile/liked-comments",
        },
        {
            label: "Followers",
            value: "/myprofile/followers"
        },
        {
            label: "Following",
            value: "/myprofile/following"
        },
        {
            label: "Saved Posts",
            value: "/myprofile/saved-posts",
        },
        {
            label: "Edit Profile",
            value: "/myprofile/edit-profile",
        },
        {
            label: "Change Password",
            value: "/myprofile/change-password",
        }
    ];

    const tabPanelsPrivate = {
        "posts": <PostList func={(page)=>getPostsByUsername(myprofile.username,page)} refreshId={refreshId}/>,
        "comments": <ReplyList func={(page)=>getCommentsByUsername(myprofile.username,page)} refreshId={refreshId}/>,
        "liked-posts": <PostList func={(page)=>getLikedPosts(page)} refreshId={refreshId}/>,
        "liked-comments": <ReplyList func={(page)=>getLikedComments(page)} refreshId={refreshId}/>,
        "followers": <UserList func={(page)=>getFollowers(myprofile.username,page)} refreshId={refreshId}/>,
        "following": <UserList func={(page)=>getFollowings(myprofile.username,page)} refreshId={refreshId}/>,
        "saved-posts": <PostList func={(page)=>getSavedPosts(page)} refreshId={refreshId}/>,
        "edit-profile": <EditProfileTemplate />,
        "change-password": <ChangePassword/>,
    }

    const tabListPublic = [
        {
            label: "Posts",
            value: `/profile/${username}/posts`,
        },
        {
            label: "Comments",
            value: `/profile/${username}/comments`,
        },
        {
            label: "Followers",
            value: `/profile/${username}/followers`
        },
        {
            label: "Following",
            value: `/profile/${username}/following`
        },
    ];

    const tabPanelsPublic = {
        "posts": <PostList func={(page)=>getPostsByUsername(username,page)} refreshId={refreshId}/>,
        "comments": <ReplyList func={(page)=>getCommentsByUsername(username,page)} refreshId={refreshId}/>,
        "followers": <UserList func={(page)=>getFollowers(username,page)} refreshId={refreshId}/>,
        "following": <UserList func={(page)=>getFollowings(username,page)} refreshId={refreshId}/>,
    }

    const routeMatch = useRouteMatch(
        self ?
            [
                '/myprofile/posts',
                '/myprofile/comments',
                '/myprofile/liked-posts',
                '/myprofile/liked-comments',
                '/myprofile/followers',
                '/myprofile/following',
                '/myprofile/saved-posts',
                '/myprofile/edit-profile',
                '/myprofile/change-password'
            ] :
            [
                `/profile/${username}/posts`,
                `/profile/${username}/comments`,
                `/profile/${username}/followers`,
                `/profile/${username}/following`
            ]
    );

    const currentTab = routeMatch?.pattern?.path;

    return (
        <Box sx={{ bgcolor: 'background.default', width: "100%" }} >
            <AppBar position="sticky"
                sx={{ top: '64px', zIndex: (theme) => theme.zIndex.drawer }}
            >
                <Tabs
                    value={currentTab}
                    indicatorColor="secondary"
                    textColor="inherit"
                    variant='scrollable'
                    scrollButtons="auto"
                >
                    {
                        self ?
                            tabListPrivate.map((tab, i) => {
                                if (!tab.hidden || (tab.hidden && self))
                                    return <Tab
                                        value={tab.value}
                                        key={i}
                                        label={tab.label}
                                        to={`../${tab.value}`}
                                        component={Link}
                                    />;
                            })
                            :
                            tabListPublic.map((tab, i) => {
                                if (!tab.hidden || (tab.hidden && self))
                                    return <Tab
                                        value={tab.value}
                                        key={i}
                                        label={tab.label}
                                        to={`../${tab.value}`}
                                        component={Link}
                                    />;
                            })
                    }
                </Tabs>
            </AppBar>
            {
                self ? tabPanelsPrivate[action] : tabPanelsPublic[action]
            }
        </Box>
    );
}