import { NERVOS_NETWORK } from '@force-bridge/commons';
import { BigNumber } from 'bignumber.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import React, { useEffect, useState } from 'react';
import { Route, useHistory, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { AppHeader } from './Header';
import { ForceBridgeContainer } from 'containers/ForceBridgeContainer';
import { BridgeView } from 'views/Bridge';

dayjs.extend(utc);

BigNumber.set({ EXPONENTIAL_AT: 99 });

const MainWrapper = styled.div`
  padding-top: 140px;
  padding-bottom: 32px;
  min-height: 100vh;
  background: linear-gradient(111.44deg, #dcf2ed 0%, #d3d9ec 100%);
  display: flex;
  align-items: center;
  justify-content: center;

  .mask {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.88);
    z-index: 1000;
    cursor: not-allowed;
  }
`;

export const AppView: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const { network } = ForceBridgeContainer.useContainer();
  const [mergeTime, setMergeTime] = useState<boolean>(false);

  useEffect(() => {
    if (location.pathname === '/') history.replace(`/bridge/${network}/${NERVOS_NETWORK}`);
  }, [network, location.pathname, history]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      const utcTime = dayjs.utc();
      const startMerge6 = dayjs.utc('2022-09-06 11:00', 'YYYY-MM-DD HH:mm');
      const endMerge6 = startMerge6.add(2, 'hours');
      const startMerge15 = dayjs.utc('2022-09-15 00:00', 'YYYY-MM-DD HH:mm');
      const endMerge15 = startMerge15.add(2, 'hours');
      if (
        (utcTime.isAfter(startMerge6) && utcTime.isBefore(endMerge6)) ||
        (utcTime.isAfter(startMerge15) && utcTime.isBefore(endMerge15))
      ) {
        setMergeTime(true);
      } else {
        setMergeTime(false);
      }
    }, 1000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <>
      <AppHeader />
      <MainWrapper>
        {mergeTime && <div className="mask"></div>}
        <Route path="/bridge/:fromNetwork/:toNetwork">
          <BridgeView />
        </Route>
      </MainWrapper>
    </>
  );
};
