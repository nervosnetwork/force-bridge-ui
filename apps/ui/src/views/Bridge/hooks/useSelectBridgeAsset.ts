import { Asset, NERVOS_NETWORK } from '@force-bridge/commons';
import { useCallback, useEffect, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { BridgeOperationFormContainer } from 'containers/BridgeOperationFormContainer';
import { BridgeDirection, ForceBridgeContainer } from 'containers/ForceBridgeContainer';
import { useAssetQuery } from 'hooks/useAssetQuery';

interface SelectedAssetState {
  selectedAsset: Asset | undefined;
  setSelectedAsset: (asset: Asset | undefined) => void;
}

// bind the selected asset with url in search params with the key of `xchain-asset`
export function useSelectBridgeAsset(): SelectedAssetState {
  const history = useHistory();
  const location = useLocation();
  const { data: assets } = useAssetQuery();
  const { direction } = ForceBridgeContainer.useContainer();
  const { setAsset } = BridgeOperationFormContainer.useContainer();

  const assetXChainIdent = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('xchain-asset');
  }, [location.search]);

  const selectedAsset = useMemo<Asset | undefined>(() => {
    if (!assets || !assetXChainIdent) return undefined;

    const found = assets.xchain.find((asset) => asset.ident === assetXChainIdent);
    if (direction === BridgeDirection.Out) return found?.shadow;
    return found;
  }, [assetXChainIdent, assets, direction]);

  useEffect(() => setAsset(selectedAsset), [selectedAsset, setAsset]);

  const setSelectedAsset = useCallback(
    (asset: Asset | undefined) => {
      const assetXChainIdent = asset?.network === NERVOS_NETWORK ? asset?.shadow?.ident : asset?.ident;

      const params = new URLSearchParams(location.search);
      params.set('xchain-asset', assetXChainIdent || '');
      history.replace({ search: params.toString() });
    },
    [history, location.search],
  );

  return { setSelectedAsset, selectedAsset };
}
