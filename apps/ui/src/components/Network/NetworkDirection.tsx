import { ArrowRightOutlined } from '@ant-design/icons';
import { Row } from 'antd';
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
      <span>
        <NetworkIcon network={from} />
        <NetworkText style={{ marginLeft: '8px' }}>{from}</NetworkText>
      </span>

      <ArrowRightOutlined style={{ margin: '0 8px' }} />

      <span>
        <NetworkIcon network={to} />
        <NetworkText>{to}</NetworkText>
      </span>
    </Row>
  );
});
