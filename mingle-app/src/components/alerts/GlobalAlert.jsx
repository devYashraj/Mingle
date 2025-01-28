import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';

export default function GlobalAlert() {
  const [open, setOpen] = React.useState(false);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const globalAlertState = useSelector((state)=>state.globalAlert)
  useEffect(()=>{
    
    const setGlobalAlert = () => {
      setOpen(true);
    }

    setGlobalAlert();
  },[globalAlertState])

  return (
    <div>
      <Snackbar open={open} autoHideDuration={2000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity={globalAlertState.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {globalAlertState.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
