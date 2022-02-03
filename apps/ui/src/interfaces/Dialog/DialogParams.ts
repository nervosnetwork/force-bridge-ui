import { ChildrenParams } from './ChildrenParams';

export interface DialogParams {
  children: ChildrenParams;
  open: boolean;
  onClose?(): void;
  onExited?(): void;
}
