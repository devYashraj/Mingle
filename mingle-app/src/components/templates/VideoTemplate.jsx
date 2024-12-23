import { Box } from '@mui/material'
import ReactPlayer from 'react-player/lazy'

export default function VideoBody({urlList}) {
  return (
    <>  
        <Box sx={{m:0,p:1}}>
         <ReactPlayer width="100%" height="80%" controls url={urlList[0]}/>
        </Box>
    </> 
  )
}