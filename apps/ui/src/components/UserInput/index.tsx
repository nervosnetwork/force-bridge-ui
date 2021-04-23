import { Input, InputProps, Row } from 'antd';
import React from 'react';
import styled from 'styled-components';

interface UserInputProps extends InputProps {
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
    <UserInputWrapper className={className}>
      <Row justify="space-between" align="middle">
        <div>{label}</div>
        <div>{extra}</div>
      </Row>
      <Input bordered={false} autoComplete="off" size="large" {...inputProps} />
    </UserInputWrapper>
  );
};
