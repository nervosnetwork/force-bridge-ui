import { MenuOutlined } from '@ant-design/icons';
import { Button, Col, Dropdown, Menu, Row } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { NetworkDirectionSelector } from './NetworkDirectionSelector';
import LogoImage from './logo.svg';
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
        <Col span={3}>
          <Logo src={LogoImage} alt="logo" />
        </Col>
        <Col span={18} style={{ textAlign: 'center' }}>
          <NetworkDirectionSelector
            networks={supportedNetworks}
            network={network}
            direction={direction}
            onSelect={({ network, direction }) => {
              switchNetwork(network);
              switchBridgeDirection(direction);
            }}
          />
        </Col>
        <Col span={3} style={{ textAlign: 'right' }}>
          <Dropdown overlay={referenceLinks}>
            <Button type="primary" icon={<MenuOutlined />} size="small" />
          </Dropdown>
        </Col>
      </Row>
    </AppHeaderWrapper>
  );
};
