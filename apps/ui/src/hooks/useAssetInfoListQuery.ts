import { Asset, AssetType, eth, FungibleBaseInfo, nervos, NERVOS_NETWORK } from '@force-bridge/commons';
import { useCallback } from 'react';
import { QueryObserverResult, useQuery } from 'react-query';
import { ForceBridgeContainer } from 'containers/ForceBridgeContainer';
import { asserts, boom } from 'errors';

interface UseAssetInfoState {
  query: QueryObserverResult<{ xchain: Record<string, Asset>; nervos: Record<string, nervos.SUDT> }>;
  infoOf: (asset: AssetType) => FungibleBaseInfo | undefined;
}

export function useAssetInfoListQuery(): UseAssetInfoState {
  const { network, api, xchainModule, nervosModule } = ForceBridgeContainer.useContainer();
  const assetNameConventionPostfix = ` | ${network.toLowerCase().slice(0, 3)}`;

  const X = xchainModule.assetModel;
  const Y = nervosModule.assetModel;
  const query = useQuery(['getAssetAssetWithInfo', { network }], async () => {
    const infoList = await api.getAssetList();

    // xchain asset info: asset.info
    const xchainAssetsInfo = infoList.filter(X.isCurrentNetworkAsset).map<Asset>((assetWithInfo) => {
      // TODO refactor to ModuleRegistry
      if (assetWithInfo.network === 'Ethereum') {
        const ident = assetWithInfo.ident;
        const info = assetWithInfo.info;

        const sudt = new nervos.SUDT({
          ...info.shadow,
          info: {
            ...assetWithInfo.info,
            shadow: assetWithInfo,
            name: `${assetWithInfo.info.name}${assetNameConventionPostfix}`,
            symbol: `${assetWithInfo.info.symbol}${assetNameConventionPostfix}`,
          },
        });

        let xchainAsset: Asset;
        if (X.isDerivedAsset(assetWithInfo)) {
          xchainAsset = new eth.ERC20({ ident, info, shadow: sudt });
        } else if (X.isNativeAsset(assetWithInfo)) {
          xchainAsset = new eth.Ether({ info, shadow: sudt });
        } else {
          boom(`asset is not valid ${JSON.stringify(assetWithInfo)}`);
        }

        sudt.setShadow(xchainAsset);

        return xchainAsset;
      }

      return boom(`Unknown network asset with ${JSON.stringify(assetWithInfo)}`);
    });

    // xchain asset.shadow
    const nervosAssetsInfo = xchainAssetsInfo.map<nervos.SUDT>((xchainAsset) => {
      asserts(xchainAsset.shadow != null);
      return xchainAsset.shadow;
    });

    const nervosOriginXchainAssetsInfo = infoList
      .filter((info) => info.network === NERVOS_NETWORK)
      .map<Asset>((assetWithInfo) => {
        const shadow = assetWithInfo.info.shadow;
        const ident = shadow.ident;

        let nervosShadow: Asset;
        if (Y.isDerivedAsset(assetWithInfo)) {
          nervosShadow = new nervos.SUDT({ ...assetWithInfo, isNervosNative: true });
        } else if (Y.isNativeAsset(assetWithInfo)) {
          nervosShadow = new nervos.CKB({ ...assetWithInfo, isNervosNative: true });
        } else {
          boom(`asset is not valid ${JSON.stringify(assetWithInfo)}`);
        }

        const info = {
          ...assetWithInfo.info,
          shadow: assetWithInfo,
          name: `${assetWithInfo.info.name} | ckb`,
          symbol: `${assetWithInfo.info.symbol} | ckb`,
        };

        let xchainAsset: Asset;
        if (X.isDerivedAsset(assetWithInfo.info.shadow)) {
          xchainAsset = new eth.ERC20({ ident, info, shadow: nervosShadow, isNervosNative: true });
        } else if (X.isNativeAsset(assetWithInfo.info.shadow)) {
          xchainAsset = new eth.Ether({ info, shadow: nervosShadow, isNervosNative: true });
        } else {
          boom(`asset is not valid ${JSON.stringify(assetWithInfo)}`);
        }

        nervosShadow.setShadow(xchainAsset);

        return xchainAsset;
      });

    // xchain asset.shadow
    const nervosOriginNervosAssetsInfo = nervosOriginXchainAssetsInfo.map<nervos.CKB | nervos.SUDT>((xchainAsset) => {
      asserts(xchainAsset.shadow != null);
      return xchainAsset.shadow;
    });

    return {
      xchain: xchainAssetsInfo
        .concat(nervosOriginXchainAssetsInfo)
        .reduce<Record<string, Asset>>((result, asset) => Object.assign(result, { [asset.ident]: asset }), {}),
      nervos: nervosAssetsInfo
        .concat(nervosOriginNervosAssetsInfo)
        .reduce<Record<string, nervos.SUDT>>((result, asset) => Object.assign(result, { [asset.ident]: asset }), {}),
    };
  });

  const infoOf = useCallback(
    (asset: { network: string; ident: string }) => {
      if (!query.data) return;
      if (asset.network === NERVOS_NETWORK) return query.data.nervos[asset.ident]?.info;
      return query.data.xchain[asset.ident]?.info;
    },
    [query],
  );

  return { query, infoOf };
}
