import { MenuOutlined } from '@ant-design/icons';
import { Alert, Col, Dropdown, Menu, Row, Typography } from 'antd';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { About } from './About';
import { NetworkDirectionSelector } from './NetworkDirectionSelector';
import { ReactComponent as Logo } from './logo.svg';
import { LinearGradientButton } from 'components/Styled';
import { ForceBridgeContainer } from 'containers/ForceBridgeContainer';

dayjs.extend(utc);
dayjs.extend(timezone);

const AppHeaderWrapper = styled.header`
  z-index: 1001;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.12);
  padding: 16px 100px;
  //height: 64px;
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

  const [time6, setTime6] = useState<string>('');
  const [date6, setDate6] = useState<string>('');
  const [time15, setTime15] = useState<string>('');
  const [date15, setDate15] = useState<string>('');
  const [tz, setTz] = useState<string>('');

  useEffect(() => {
    const tz = dayjs.tz.guess();
    const startMerge6 = dayjs.utc('2022-09-06 11:00', 'YYYY-MM-DD HH:mm');
    setTime6(startMerge6.tz(tz).format('HH:mm'));
    setDate6(startMerge6.tz(tz).get('date').toString());
    const startMerge15 = dayjs.utc('2022-09-15 00:00', 'YYYY-MM-DD HH:mm');
    setTime15(startMerge15.tz(tz).format('HH:mm'));
    setDate15(startMerge15.tz(tz).get('date').toString());
    setTz(tz);
  }, []);

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
      <Alert
        closable
        message={
          <div style={{ textAlign: 'center' }}>
            <Typography.Text>
              Due to the "The Merge" upgrade of Ethereum, Force Bridge has to be out of service at {time6} on {date6}th
              Sept. and {time15} on {date15}th Sept. in {tz} timezone for 14 hours respectively. Thanks and please be
              patient during the maintenance.
            </Typography.Text>
          </div>
        }
        type="warning"
        style={{ marginBottom: '18px' }}
      />
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
