import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import ListItem from '@tiptap/extension-list-item';
import TextStyle from '@tiptap/extension-text-style';
import StarterKit from '@tiptap/starter-kit';
import { Box, IconButton, Stack, Tooltip } from '@mui/material';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatStrikethroughIcon from '@mui/icons-material/FormatStrikethrough';
import FormatTextdirectionLToRIcon from '@mui/icons-material/FormatTextdirectionLToR';
import CodeIcon from '@mui/icons-material/Code';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';

const RichTextField = ({ value, onChange }) => {
    const editor = useEditor({
        extensions: [
            TextStyle.configure({ types: [ListItem.name] }),
            StarterKit.configure({
                bulletList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
                orderedList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
            }),
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    })

    if (!editor) {
        return null
    }

    const actions = [
        {
            icon: <FormatBoldIcon />,
            label: "Bold",
            action: () => editor.chain().focus().toggleBold().run(),
            disable: !editor.can().chain().focus().toggleBold().run(),
            color: editor.isActive('bold') ? 'secondary' : ''
        },
        {
            icon: <FormatItalicIcon />,
            label: "Italic",
            action: () => editor.chain().focus().toggleItalic().run(),
            disable: !editor.can().chain().focus().toggleItalic().run(),
            color: editor.isActive('italic') ? 'secondary' : ''
        },
        {
            icon: <FormatStrikethroughIcon />,
            label: "Strikethrough",
            action: () => editor.chain().focus().toggleStrike().run(),
            disable: !editor.can().chain().focus().toggleStrike().run(),
            color: editor.isActive('strike') ? 'secondary' : ''
        },
        {
            icon: <FormatTextdirectionLToRIcon />,
            label: "Paragraph",
            action: () => editor.chain().focus().setParagraph().run(),
            disable: false,
            color: editor.isActive('paragraph') ? 'secondary' : ''
        },
        {
            icon: <CodeIcon />,
            label: "Code Block",
            action: () => editor.chain().focus().toggleCodeBlock().run(),
            disable: false,
            color: editor.isActive('codeBlock') ? 'secondary' : ''
        },
        {
            icon: <FormatListBulletedIcon />,
            label: "Bullet List",
            action: () => editor.chain().focus().toggleBulletList().run(),
            disable: false,
            color: editor.isActive('bulletList') ? 'secondary' : ''
        },
        {
            icon: <FormatListNumberedIcon />,
            label: "Ordered List",
            action: () => editor.chain().focus().toggleOrderedList().run(),
            disable: false,
            color: editor.isActive('orderedList') ? 'secondary' : ''
        }
    ];
    return (
        <Box
            sx={{
                border: '1px solid gray',
                m: 2, p: 1
            }}
        >
            <Stack direction='row'>
                {
                    actions.map((a, i) => (
                        <Tooltip key={i} title={a.label}>
                            <IconButton color={a.color} onClick={a.action}>
                                {a.icon}
                            </IconButton>
                        </Tooltip>
                    ))
                }
            </Stack>
            <EditorContent editor={editor} className='editor' />
        </Box>
    )
}

export default function RichTextEditor({content, setContent}) {
    
    return (
        <>
            <RichTextField
                value={content}
                onChange={(newValue) => setContent(newValue)}
            />
        </>
    )
}
