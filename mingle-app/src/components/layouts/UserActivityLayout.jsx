import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`full-width-tabpanel-${index}`}
            aria-labelledby={`full-width-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 0 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `full-width-tab-${index}`,
        'aria-controls': `full-width-tabpanel-${index}`,
    };
}

import ReplyList from '../lists/ReplyList';
import PostTemplate from '../templates/PostTemplate';
import { useState, useEffect } from 'react';
import { tabList } from '../../utils/constants';

import { postList } from "../../utils/sampleData";

function UserComments() {

    useEffect(() => {
        console.log("getting comments");
    }, []);

    return (
        <>
            <ReplyList />
        </>
    )
}

function UserPosts() {

    useEffect(() => {
        console.log("getting posts");
    }, []);

    return (
        postList.map((postData) => (
            <PostTemplate key={postData._id} postData={postData} />
        ))
    )
}


export default function ProfileActivity({ self = true }) {
    const theme = useTheme();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const tabPanels = [
        {
            component: <UserPosts />,
            hidden: false
        },
        {
            component: <UserComments />,
            hidden: false

        },
        {
            component: "Edit Profile",
            hidden: true
        },
        {
            component: "Liked Posts",
            hidden: true
        },
        {
            component: "Liked Comments",
            hidden: true
        },
        {
            component: "Saved Posts",
            hidden: true
        }
    ]

    return (
        <Box sx={{ bgcolor: 'background.default', width: "100%" }} >
            <AppBar position="sticky"
                sx={{ top: '64px', zIndex: (theme) => theme.zIndex.drawer }}
            >
                <Tabs
                    value={value}
                    onChange={handleChange}
                    indicatorColor="secondary"
                    textColor="secondary"
                    variant='scrollable'
                    scrollButtons="auto"
                >
                    {
                        tabList.map((tab, i) => {
                            if (!tab.hidden || (tab.hidden && self))
                                return <Tab key={i} label={tab.label} {...a11yProps(i)} />;
                        })
                    }
                </Tabs>
            </AppBar>

            {
                tabPanels.map((panel, i) => {
                    if (!panel.hidden || (panel.hidden && self))
                        return (
                            <TabPanel key={i} value={value} index={i} dir={theme.direction}>
                                {panel.component}
                            </TabPanel>
                        )
                })
            }
        </Box>
    );
}