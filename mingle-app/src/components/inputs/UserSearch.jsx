import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { useState, useEffect, useMemo } from 'react';
import { debounce } from '@mui/material';
import { getUserList as getUsers} from '../../api/users.api.js';

export default function UserSearch({ selectedUsers, setSelectedUsers }) {
    const [open, setOpen] = useState(false);
    const [options, setOptions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    const handleOpen = () => {
        setOpen(true);
    };

    const getUserList = async (query) => {
        const response = await getUsers(query);
        return response.data;
    }

    const fetchUsers = useMemo(
        () => 
            debounce(async (query)=>{
                setLoading(true);
                const results = await getUserList(query);
                setOptions(results);
                setLoading(false);
            },1000),
        []
    );

    useEffect(()=>{
        if(searchQuery){
            setLoading(true);
            fetchUsers(searchQuery);
        }
        else    
            setOptions([])
    },[searchQuery, fetchUsers])

    const handleClose = () => {
        setOpen(false);
        setOptions([]);
    };

    return (
        <Autocomplete
            open={open}
            multiple
            filterOptions={(x)=>x}
            value={selectedUsers}
            onChange={(event, newValue) => setSelectedUsers(newValue)}
            onOpen={handleOpen}
            onClose={handleClose}
            isOptionEqualToValue={(option, value) => option.username === value.username}
            getOptionLabel={(option) => option.fullname + '  @' + option.username}
            options={options}
            loading={loading}
            renderInput={(params) => (
                <TextField
                    {...params}
                    fullWidth
                    label="Add Chat Members"
                    value={searchQuery}
                    onChange={(e)=>setSearchQuery(e.target.value)}
                    slotProps={{
                        input: {
                            ...params.InputProps,
                            endAdornment: (
                                <React.Fragment>
                                    {loading ? <CircularProgress color="secondary" size={20} /> : null}
                                    {params.InputProps.endAdornment}
                                </React.Fragment>
                            ),
                        },
                    }}
                />
            )}
        />
    );
}

// Top films as rated by IMDb users. http://www.imdb.com/chart/top
const topFilms = [
    { title: 'The Shawshank Redemption', year: 1994 },
    { title: 'The Godfather', year: 1972 },
    { title: 'The Godfather: Part II', year: 1974 },
    { title: 'The Dark Knight', year: 2008 },
    { title: '12 Angry Men', year: 1957 },
    { title: "Schindler's List", year: 1993 },
    { title: 'Pulp Fiction', year: 1994 },
    {
        title: 'The Lord of the Rings: The Return of the King',
        year: 2003,
    },
    { title: 'The Good, the Bad and the Ugly', year: 1966 },
    { title: 'Fight Club', year: 1999 },
    {
        title: 'The Lord of the Rings: The Fellowship of the Ring',
        year: 2001,
    },
    {
        title: 'Star Wars: Episode V - The Empire Strikes Back',
        year: 1980,
    },
    { title: 'Forrest Gump', year: 1994 },
    { title: 'Inception', year: 2010 },
    {
        title: 'The Lord of the Rings: The Two Towers',
        year: 2002,
    },
    { title: "One Flew Over the Cuckoo's Nest", year: 1975 },
    { title: 'Goodfellas', year: 1990 },
    { title: 'The Matrix', year: 1999 },
    { title: 'Seven Samurai', year: 1954 },
    {
        title: 'Star Wars: Episode IV - A New Hope',
        year: 1977,
    },
    { title: 'City of God', year: 2002 },
    { title: 'Se7en', year: 1995 },
    { title: 'The Silence of the Lambs', year: 1991 },
    { title: "It's a Wonderful Life", year: 1946 },
    { title: 'Life Is Beautiful', year: 1997 },
    { title: 'The Usual Suspects', year: 1995 },
    { title: 'Léon: The Professional', year: 1994 },
    { title: 'Spirited Away', year: 2001 },
    { title: 'Saving Private Ryan', year: 1998 },
    { title: 'Once Upon a Time in the West', year: 1968 },
    { title: 'American History X', year: 1998 },
    { title: 'Interstellar', year: 2014 },
];
