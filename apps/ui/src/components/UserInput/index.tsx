import { Input, InputProps, Row, Tooltip } from 'antd';
import React from 'react';
import styled from 'styled-components';

export interface UserInputProps extends InputProps {
  label?: React.ReactNode;
  extra?: React.ReactNode;
}

const UserInputWrapper = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 16px;
  padding: 16px 12px;

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
      <Tooltip
        color="volcano"
        mouseEnterDelay={0}
        title="Notice: make sure the recipient address support sUDT transfer (please don't bridge to any recipient address not support sUDT transfer)."
      >
        <Input bordered={false} autoComplete="off" size="large" {...inputProps} />
      </Tooltip>
    </UserInputWrapper>
  );
};
