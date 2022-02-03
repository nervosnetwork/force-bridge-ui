import React from 'react';
import { DialogContainer } from './DialogContainer';
import { DialogParams } from 'interfaces/Dialog/DialogParams';

type ProviderContext = readonly [(option: DialogOption) => void, () => void];

const EMPTY_FUNC = () => undefined;
const DialogContext = React.createContext<ProviderContext>([EMPTY_FUNC, EMPTY_FUNC]);
export const useDialog = (): ProviderContext => React.useContext(DialogContext);

type DialogOption = Omit<DialogParams, 'open'>;

interface DialogProviderProps {
  children: React.ReactNode;
}

const DialogProvider: React.FC<DialogProviderProps> = (props): JSX.Element => {
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
};

export default DialogProvider;
