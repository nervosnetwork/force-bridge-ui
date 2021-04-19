import { Skeleton } from 'antd';
import React from 'react';
import styled from 'styled-components';
import { StyledCardWrapper } from 'components/Styled';
import { WalletConnectorButton } from 'components/WalletConnector';

const BridgeViewWrapper = styled.div`
  height: calc(100vh - 64px);
  background: linear-gradient(111.44deg, #dcf2ed 0%, #d3d9ec 100%);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const BridgeView: React.FC = () => {
  return (
    <BridgeViewWrapper>
      <StyledCardWrapper>
        <WalletConnectorButton block type="primary" />
        <Skeleton loading />
      </StyledCardWrapper>
    </BridgeViewWrapper>
  );
};
