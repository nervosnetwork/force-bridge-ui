import { MenuOutlined } from '@ant-design/icons';
import { Col, Dropdown, Menu, Row } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { NetworkDirectionSelector } from './NetworkDirectionSelector';
import LogoImage from './logo.svg';
import { LinearGradientButton } from 'components/Styled';
import { useForceBridge } from 'state';

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

const Logo = styled.img`
  height: 32px;
`;

export const AppHeader: React.FC = () => {
  const { network, direction, switchBridgeDirection, switchNetwork, supportedNetworks } = useForceBridge();

  const referenceLinks = (
    <Menu>
      <Menu.Item>
        <a href="https://github.com/nervosnetwork/force-bridge" target="_blank" rel="noreferrer">
          GitHub
        </a>
      </Menu.Item>
    </Menu>
  );

  return (
    <AppHeaderWrapper>
      <Row justify="space-between" align="middle" gutter={16}>
        <Col md={3} sm={2} xs={2}>
          <Logo src={LogoImage} alt="logo" />
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
