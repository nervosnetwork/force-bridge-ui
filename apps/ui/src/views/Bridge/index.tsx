import { Asset } from '@force-bridge/commons';
import React, { useState } from 'react';
import { BridgeHistory } from './BridgeHistory';
import { BridgeOperation } from './BridgeOperation';
import { useBindRouteAndBridgeState } from './useBindRouteAndBridgeState';
import { XChainEntry } from 'xchain';

export const BridgeView: React.FC = () => {
  const [selectedAsset, setSelectedAsset] = useState<Asset | undefined>();
  useBindRouteAndBridgeState();

  return (
    <XChainEntry>
      <BridgeOperation onAssetSelected={setSelectedAsset} />
      <div style={{ padding: '8px' }} />
      {selectedAsset && <BridgeHistory asset={selectedAsset} />}
    </XChainEntry>
  );
};
