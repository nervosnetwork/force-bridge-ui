import { InputBaseProps, Tooltip, Typography } from '@mui/material';
import React from 'react';
import { CustomInput } from './styled';

export interface UserInputProps extends InputBaseProps {
  label: React.ReactNode;
  tooltip?: boolean;
}

export const UserInput: React.FC<UserInputProps> = (props) => {
  const { label, tooltip, ...inputProps } = props;

  const customInput = <CustomInput sx={{ flex: 1 }} {...inputProps} />;

  return (
    <>
      <Typography color="text.primary" variant="body1" marginTop={3} marginBottom={1}>
        {label}
      </Typography>
      {tooltip ? (
        <Tooltip title="Please make sure the filled address belong to a sUDT-compatible application, otherwise your funds may be locked until the application adds sUDT support.">
          {customInput}
        </Tooltip>
      ) : (
        customInput
      )}
    </>
  );
};
