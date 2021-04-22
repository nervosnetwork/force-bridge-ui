import React from 'react';
import styled from 'styled-components';
import { AssetSelector } from 'components/AssetSelector';
import { StyledCardWrapper } from 'components/Styled';
import { UserInput } from 'components/UserInput';
import { WalletConnectorButton } from 'components/WalletConnector';
import { useForceBridge } from 'state';
import { useAsset } from 'state/assets/useAsset';

const BridgeViewWrapper = styled.div`
  height: calc(100vh - 64px);
  background: linear-gradient(111.44deg, #dcf2ed 0%, #d3d9ec 100%);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const BridgeView: React.FC = () => {
  const { signer, xchainModule } = useForceBridge();
  const { query } = useAsset();

  return (
    <BridgeViewWrapper>
      <StyledCardWrapper>
        <WalletConnectorButton block type="primary" />
        <UserInput
          label={
            <span>
              From:&nbsp;
              <AssetSelector
                btnProps={{ disabled: query.data == null }}
                options={query.data?.xchain || []}
                rowKey={(asset) => xchainModule.assetModel.identity(asset)}
                onSelect={console.log}
              />
            </span>
          }
          extra={'world'}
          disabled={signer == null}
        />
      </StyledCardWrapper>
    </BridgeViewWrapper>
  );
};
