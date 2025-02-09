import { styled } from '@mui/material/styles';

export const getFileExtension = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();
    return extension;
}

export const urlGenerator = (fileList) => {
    const mediaUrls = [];
    for (const file of fileList) {
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

function stringToColor(string) {
    let hash = 0;
    let i;

    for (i = 0; i < string?.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
}

export function stringAvatar(name) {
    return {
        sx: {
            bgcolor: stringToColor(name),
        },
        children: `${name?.split(' ')[0][0]}`,
    };
}

export const getChatName = (chat,myUsername) => {
    if(chat.isGroupChat){
        return chat.name
    }
    const otherMember = chat.participants.filter((m)=>m.username !== myUsername)
    return otherMember[0].fullname;
}

export const CHAT_EVENTS = {
    CONNECTED: "connected",

    DISCONNECT: "disconnect",

    JOIN_CHAT: "joinChat",

    LEAVE_CHAT: "leaveChat",

    MSG_RECEIVED: "messageReceived",

    NEW_CHAT: "newChat",

    STOP_TYPING: "stopTyping",

    TYPING: "typing",
    
    SOCKET_ERROR : "socketError",
}