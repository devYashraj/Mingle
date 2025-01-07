import { styled } from '@mui/material/styles';

export const getFileExtension = (filename) =>{
    const extension = filename.split('.').pop().toLowerCase();
    return extension;
}

export const urlGenerator = (fileList) => {
    const mediaUrls = [];
    for(const file of fileList)
    {
        mediaUrls.push(URL.createObjectURL(file));
    }
    return mediaUrls;
}

export const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});