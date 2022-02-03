export interface ChildrenParams {
  fromNetwork?: string;
  submitForm?: boolean;
  dialogContent: React.ReactNode;
  title: string;
  onOk?(): void;
  closeDialog(): void;
}
