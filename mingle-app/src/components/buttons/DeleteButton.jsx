import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

export default function DeleteButton(props) {
  return (
    <>  
         <IconButton {...props}>
            <DeleteIcon fontSize='small'/>
         </IconButton>
    </> 
  )
}