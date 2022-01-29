import { Button, DialogActions, DialogTitle } from '@mui/material';
import React from 'react';
import { CustomizedDialog } from 'components/TransferModal/styled';

type ProviderContext = readonly [(option: DialogOption) => void, () => void];

const EMPTY_FUNC = () => undefined;
const DialogContext = React.createContext<ProviderContext>([EMPTY_FUNC, EMPTY_FUNC]);
export const useDialog = (): ProviderContext => React.useContext(DialogContext);

type ChildrenParams = {
  fromNetwork?: string;
  submitForm?: boolean;
  dialogContent: React.ReactNode;
  title: string;
  closeDialog(): void;
};

type DialogParams = {
  children: ChildrenParams;
  open: boolean;
  onClose?(): void;
  onExited?(): void;
};
type DialogOption = Omit<DialogParams, 'open'>;
type DialogContainerProps = DialogParams & {
  onClose: () => void;
  onKill: () => void;
};

function DialogContainer(props: DialogContainerProps) {
  const { children, open, onClose, onKill } = props;

  return (
    <CustomizedDialog open={open} onClose={onClose} TransitionProps={{ onExited: onKill }}>
      <>
        <DialogTitle sx={{ textAlign: 'center' }}>{children.title}</DialogTitle>
        {children.dialogContent}
        <DialogActions>
          <Button color="primary" onClick={() => children.closeDialog()}>
            Close
          </Button>
        </DialogActions>
      </>
    </CustomizedDialog>
  );
}

interface DialogProviderProps {
  children: React.ReactNode;
}

export default function DialogProvider(props: DialogProviderProps): JSX.Element {
  const { children } = props;
  const [dialogs, setDialogs] = React.useState<DialogParams[]>([]);
  const createDialog = (option: DialogOption) => {
    const dialog = { ...option, open: true };
    setDialogs((dialogs) => [...dialogs, dialog]);
  };
  const closeDialog = () => {
    setDialogs((dialogs) => {
      const latestDialog = dialogs.pop();
      if (!latestDialog) return dialogs;
      if (latestDialog.onClose) latestDialog.onClose();
      return [...dialogs].concat({ ...latestDialog, open: false });
    });
  };
  const contextValue = React.useRef([createDialog, closeDialog] as const);

  return (
    <DialogContext.Provider value={contextValue.current}>
      {children}
      {dialogs.map((dialog, i) => {
        const { onClose, ...dialogParams } = dialog;
        const handleKill = () => {
          if (dialog.onExited) dialog.onExited();
          setDialogs((dialogs) => dialogs.slice(0, dialogs.length - 1));
        };

        return <DialogContainer key={i} onClose={closeDialog} onKill={handleKill} {...dialogParams} />;
      })}
    </DialogContext.Provider>
  );
}
