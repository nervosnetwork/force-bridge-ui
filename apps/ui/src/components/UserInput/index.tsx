import { Input, InputProps, Row } from 'antd';
import React from 'react';
import styled from 'styled-components';

interface UserInputProps extends InputProps {
  label: React.ReactNode;
  extra: React.ReactNode;
}

const UserInputWrapper = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 16px;
  padding: 16px;
`;

export const UserInput: React.FC<UserInputProps> = (props) => {
  const { label, extra, ...inputProps } = props;
  return (
    <UserInputWrapper>
      <Row justify="space-between">
        <div>{label}</div>
        <div>{extra}</div>
      </Row>
      <Input bordered={false} autoComplete="off" size="large" {...inputProps} />
    </UserInputWrapper>
  );
};
