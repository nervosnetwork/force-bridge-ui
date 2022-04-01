import { API } from '@force-bridge/commons';
import { useMemo } from 'react';
import { QueryObserverResult, useQuery } from 'react-query';
import { useDebounce } from 'use-debounce';
import { useValidateInput } from './useValidateForm';
import { BridgeOperationFormContainer } from 'containers/BridgeOperationFormContainer';
import { BridgeDirection, ForceBridgeContainer } from 'containers/ForceBridgeContainer';
import { asserts } from 'errors';
import { BeautyAmount } from 'libs';

export function useBridgeFeeQuery(): QueryObserverResult<API.GetBridgeInNervosBridgeFeeResponse, Error> {
  const { api, direction, network } = ForceBridgeContainer.useContainer();
  // FIXME use network from ForceBridgeContainer if backend support
  const ethereumNetwork = 'Ethereum';
  const { asset, bridgeFromAmount: input } = BridgeOperationFormContainer.useContainer();
  const validate = useValidateInput();

  const [bridgeInAmount] = useDebounce(input, 250, { leading: true });

  const amount = useMemo(() => {
    if (!asset || !asset.info || !bridgeInAmount || !(Number(bridgeInAmount) > 0)) return '';

    return BeautyAmount.fromHumanize(bridgeInAmount, asset.info.decimals).val.toString();
  }, [asset, bridgeInAmount]);

  return useQuery(
    ['getBridgeFee', { direction, asset: asset?.identity(), amount, network, isNervosNative: asset?.isNervosNative }],
    () => {
      asserts(asset != null && asset.shadow != null);
      const shadow = asset.shadow;

      if (asset.isNervosNative) {
        if (direction === BridgeDirection.In) {
          return new Promise((resolve, reject) => {
            api
              .getBridgeNervosToXchainBurnBridgeFee({
                xchain: ethereumNetwork,
                typescriptHash: shadow.ident,
                amount,
              })
              .then((resp) => {
                resolve({
                  fee: {
                    ...resp,
                    ident: shadow.ident,
                    network: asset.shadow?.network,
                  },
                });
              })
              .catch((e) => {
                reject(e);
              });
          });
        }

        return new Promise((resolve, reject) => {
          api
            .getBridgeNervosToXchainLockBridgeFee({
              xchain: ethereumNetwork,
              typescriptHash: asset.ident,
              amount,
            })
            .then((resp) => {
              resolve({
                fee: {
                  ...resp,
                  ident: asset.ident,
                  network: asset.network,
                },
              });
            })
            .catch((e) => {
              reject(e);
            });
        });
      } else {
        if (direction === BridgeDirection.In) {
          return api.getBridgeInNervosBridgeFee({ network: ethereumNetwork, amount, xchainAssetIdent: asset.ident });
        }

        return api.getBridgeOutNervosBridgeFee({
          network: ethereumNetwork,
          amount,
          xchainAssetIdent: asset.shadow.ident,
        });
      }
    },
    {
      enabled: !!asset && !!amount && !validate()?.bridgeInInputAmount,
      refetchInterval: false,
      retry: false,
    },
  );
}
