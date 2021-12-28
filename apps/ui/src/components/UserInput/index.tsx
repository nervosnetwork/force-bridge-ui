import {
  Button,
  FilledInput,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputBase,
  Paper,
  Typography,
} from '@mui/material';
import { InputProps, Row } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { InputWrapper } from './styled';

export interface UserInputProps extends InputProps {
  label?: React.ReactNode;
  extra?: React.ReactNode;
}

const UserInputWrapper = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 16px;
  padding: 16px;

  .ant-input,
  .ant-input-lg {
    padding: 8px 0 0;
    border-radius: 0;
  }
`;

export const UserInput: React.FC<UserInputProps> = (props) => {
  const { label, extra, className, ...inputProps } = props;
  return (
    <>
      <Typography color="text.primary" variant="body1" marginTop={3} marginBottom={1}>
        {label}
      </Typography>
      <InputWrapper>
        <InputBase sx={{ ml: 1, flex: 1 }} inputProps={{ ...inputProps }} />
        {extra}
      </InputWrapper>
    </>
  );
};
