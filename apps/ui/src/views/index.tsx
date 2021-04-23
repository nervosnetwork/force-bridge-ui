import React from 'react';
import styled from 'styled-components';
import { BridgeView } from './Bridge';

const AppViewWrapper = styled.div`
  padding-top: 96px;
  padding-bottom: 32px;
  min-height: 100vh;
  background: linear-gradient(111.44deg, #dcf2ed 0%, #d3d9ec 100%);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const AppView: React.FC = () => {
  return (
    <AppViewWrapper>
      <BridgeView />
    </AppViewWrapper>
  );
};
