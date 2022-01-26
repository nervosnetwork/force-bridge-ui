import { InputBaseProps, Typography } from '@mui/material';
import React from 'react';
import { CustomInput } from './styled';

export interface UserInputProps extends InputBaseProps {
  label?: React.ReactNode;
}

export const UserInput: React.FC<UserInputProps> = (props) => {
  const { label, ...inputProps } = props;
  return (
    <>
      <Typography color="text.primary" variant="body1" marginTop={3} marginBottom={1}>
        {label}
      </Typography>
      <CustomInput sx={{ ml: 1, flex: 1 }} {...inputProps} />
    </>
  );
};
