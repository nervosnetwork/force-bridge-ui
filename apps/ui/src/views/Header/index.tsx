import { MenuOutlined } from '@ant-design/icons';
import { Col, Dropdown, Menu, Row } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { About } from './About';
import { NetworkDirectionSelector } from './NetworkDirectionSelector';
import { ReactComponent as Logo } from './logo.svg';
import { LinearGradientButton } from 'components/Styled';
import { ForceBridgeContainer } from 'containers/ForceBridgeContainer';

const AppHeaderWrapper = styled.header`
  z-index: 1;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.12);
  padding: 16px 100px;
  height: 64px;
  background: ${(props) => props.theme.palette.common.white};

  @media (max-width: 768px) {
    padding: 16px 24px;
  }
`;

export const AppHeader: React.FC = () => {
  const {
    network,
    direction,
    switchBridgeDirection,
    switchNetwork,
    supportedNetworks,
  } = ForceBridgeContainer.useContainer();

  const referenceLinks = (
    <Menu>
      <Menu.Item>
        <a
          href="https://github.com/nervosnetwork/force-bridge/blob/main/docs/dapp-user-guide.md"
          target="_blank"
          rel="noreferrer"
        >
          User Guide
        </a>
      </Menu.Item>
      <Menu.Item>
        <a href="https://github.com/nervosnetwork/force-bridge" target="_blank" rel="noreferrer">
          GitHub
        </a>
      </Menu.Item>
      <Menu.Item>
        <About />
      </Menu.Item>
    </Menu>
  );

  return (
    <AppHeaderWrapper>
      <Row justify="space-between" align="middle" gutter={16}>
        <Col md={3} sm={2} xs={2}>
          <div>
            <Logo height="32px" width="62px" />
          </div>
        </Col>
        <Col md={18} sm={22} xs={22}>
          <div style={{ maxWidth: '300px', margin: '0 auto' }}>
            <NetworkDirectionSelector
              networks={supportedNetworks}
              network={network}
              direction={direction}
              onSelect={({ network, direction }) => {
                switchNetwork(network);
                switchBridgeDirection(direction);
              }}
            />
          </div>
        </Col>
        <Col md={3} sm={0} xs={0} style={{ textAlign: 'right' }}>
          <Dropdown overlay={referenceLinks}>
            <LinearGradientButton icon={<MenuOutlined />} size="small" />
          </Dropdown>
        </Col>
      </Row>
    </AppHeaderWrapper>
  );
};
