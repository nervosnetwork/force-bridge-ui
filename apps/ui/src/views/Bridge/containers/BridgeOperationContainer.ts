import { Asset } from '@force-bridge/commons';
import { useState } from 'react';
import { createContainer } from 'unstated-next';

interface BridgeOperationState {
  selectedAsset: Asset | undefined;
  setSelectedAsset: (asset: Asset) => void;
}

export const BridgeOperationContainer = createContainer<BridgeOperationState>(() => {
  const [selectedAsset, setSelectedAsset] = useState<Asset | undefined>();

  return { selectedAsset, setSelectedAsset };
});
