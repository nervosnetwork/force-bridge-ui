import { Button, DialogActions, DialogTitle } from '@mui/material';
import React from 'react';
import { CustomizedDialog } from 'components/TransferModal/styled';
import { DialogParams } from 'interfaces/Dialog/DialogParams';

interface DialogContainerProps extends DialogParams {
  onClose: () => void;
  onKill: () => void;
}

export const DialogContainer: React.FC<DialogContainerProps> = (props) => {
  const { children, open, onClose, onKill } = props;

  return (
    <CustomizedDialog open={open} onClose={onClose} TransitionProps={{ onExited: onKill }}>
      <>
        <DialogTitle sx={{ textAlign: 'center' }}>{children.title}</DialogTitle>
        {children.dialogContent}
        <DialogActions>
          <Button color="secondary" variant="contained" onClick={() => children.closeDialog()}>
            Close
          </Button>
          {children.onOk && (
            <Button color="primary" variant="contained" onClick={() => children.onOk && children.onOk()}>
              Ok
            </Button>
          )}
        </DialogActions>
      </>
    </CustomizedDialog>
  );
};
