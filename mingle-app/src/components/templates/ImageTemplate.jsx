import React, { useState } from 'react';
import { IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { Container, Box, Typography } from "@mui/material";

function ImageCarousel({ images, handleClose }) {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prevIndex) =>
            prevIndex === 0 ? images.length - 1 : prevIndex - 1
        );
    };

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                bgcolor: 'black',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
            }}
        >
            <IconButton
                onClick={handleClose}
                sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    color: 'white',
                    zIndex: 10,
                }}
            >
                <CloseIcon />
            </IconButton>

            <Box
                component="img"
                src={images[currentIndex]}
                alt={`Slide ${currentIndex + 1}`}
                sx={{
                    maxWidth: '80%',
                    maxHeight: '80%',
                    objectFit: 'cover',
                    borderRadius: 2,
                }}
            />

            <IconButton
                onClick={handlePrev}
                sx={{
                    position: 'absolute',
                    left: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'white',
                    bgcolor: 'rgba(0, 0, 0, 0.5)',
                    '&:hover': {
                        bgcolor: 'rgba(0, 0, 0, 0.7)',
                    },
                }}
            >
                <ArrowBackIosIcon />
            </IconButton>

            <IconButton
                onClick={handleNext}
                sx={{
                    position: 'absolute',
                    right: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'white',
                    bgcolor: 'rgba(0, 0, 0, 0.5)',
                    '&:hover': {
                        bgcolor: 'rgba(0, 0, 0, 0.7)',
                    },
                }}
            >
                <ArrowForwardIosIcon />
            </IconButton>
        </Box>
    );
}

function ImageContainer({ imgList, handleClickOpen }) {

    const more = imgList.length - 1;

    return (
        <Container className="mediaHover"
            sx={{p:1, m: 0}}>
            <Box
                component="img"
                className='coverImage'
                src={imgList[0]}
                alt="alt image"
                width="100%"
                onClick={handleClickOpen}
            />

            {more &&
                <Typography className="hoverOverlay" onClick={handleClickOpen}>
                    +{more}
                </Typography>
            }

        </Container>
    )
}

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function ImageTemplate({ imgList }) {
    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <React.Fragment>
            <ImageContainer
                handleClickOpen={handleClickOpen}
                imgList={imgList}
            />
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <ImageCarousel handleClose={handleClose} images={imgList} />
            </Dialog>
        </React.Fragment>
    );
}