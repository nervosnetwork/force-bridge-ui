import { ArrowRightOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { NetworkIcon } from 'components/Network/NetworkIcon';

export interface NetworkDirectionProps {
  from: string;
  to: string;
}

const NetworkText = styled.strong`
  margin-left: 8px;
`;

export const NetworkDirection: React.FC<NetworkDirectionProps> = React.forwardRef((props) => {
  const { from, to } = props;

  return (
    <Row justify="center" align="middle">
      <Col span={10}>
        <span>
          <NetworkIcon network={from} />
          <NetworkText style={{ marginLeft: '8px' }}>{from}</NetworkText>
        </span>
      </Col>

      <Col span={4}>
        <ArrowRightOutlined style={{ margin: '0 8px' }} />
      </Col>

      <Col span={10}>
        <span>
          <NetworkIcon network={to} />
          <NetworkText>{to}</NetworkText>
        </span>
      </Col>
    </Row>
  );
});
