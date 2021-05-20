import { Button, ButtonProps } from 'antd';
import React from 'react';
import { AllowanceState } from 'views/Bridge/Ethereum/hooks/useAllowance';

interface SubmitButtonProps extends ButtonProps {
  isloading: boolean;
  allowanceStatus: AllowanceState | undefined;
}

export const SubmitButton: React.FC<SubmitButtonProps> = (props) => {
  const { isloading, allowanceStatus, ...buttonProps } = props;
  if (!allowanceStatus) {
    return (
      <Button loading={isloading} {...buttonProps}>
        Bridge
      </Button>
    );
  }

  let isLoading = false;
  let content;
  if (allowanceStatus.status === 'Querying' || allowanceStatus.status === 'Approving' || isloading) {
    isLoading = true;
  }
  switch (allowanceStatus.status) {
    case 'NeedApprove':
      content = 'Approve';
      break;
    case 'Approving':
      content = 'Approving';
      break;
    case 'Approved':
      content = 'Bridge';
      break;
    default:
      content = ' ';
  }

  return (
    <Button loading={isLoading} {...buttonProps}>
      {content}
    </Button>
  );
};
