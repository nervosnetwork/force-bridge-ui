import { ArrowRightOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { NetworkIcon } from 'components/Network/NetworkIcon';

export interface NetworkDirectionProps {
  from: string;
  to: string;
}

const StyledCol = styled(Col)`
  color: ${(props) => props.theme.palette.common.black};
  font-weight: bold;

  .name {
    margin-left: 8px;
  }
`;

export const NetworkDirection: React.FC<NetworkDirectionProps> = (props) => {
  const { from, to } = props;

  return (
    <Row justify="center" align="middle" gutter={8}>
      <StyledCol span={10}>
        <NetworkIcon network={from} />
        <span className="name">{from}</span>
      </StyledCol>

      <StyledCol span={4}>
        <ArrowRightOutlined />
      </StyledCol>

      <StyledCol span={10}>
        <NetworkIcon network={to} />
        <span className="name">{to}</span>
      </StyledCol>
    </Row>
  );
};
