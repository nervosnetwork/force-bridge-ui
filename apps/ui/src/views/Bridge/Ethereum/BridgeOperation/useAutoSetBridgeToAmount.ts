import { useEffect } from 'react';
import { BridgeOperationFormContainer } from 'containers/BridgeOperationFormContainer';
import { useBridgeFeeQuery } from 'hooks/bridge-operation';
import { BeautyAmount } from 'libs';

export function useAutoSetBridgeToAmount(): void {
  const { setBridgeToAmount, bridgeFromAmount, asset: selectedAsset } = BridgeOperationFormContainer.useContainer();
  const feeQuery = useBridgeFeeQuery();

  const feeAmount = feeQuery.data?.fee.amount;

  useEffect(() => {
    if (!feeAmount || !selectedAsset || !selectedAsset.info) {
      setBridgeToAmount('0');
      return;
    }

    const actualReceived = BeautyAmount.fromHumanize(bridgeFromAmount, selectedAsset.info.decimals)
      .setVal((bn) => bn.minus(feeAmount))
      .humanize({ decimalPlaces: Infinity, separator: false });

    setBridgeToAmount(actualReceived);
  }, [bridgeFromAmount, setBridgeToAmount, feeAmount, selectedAsset]);
}
