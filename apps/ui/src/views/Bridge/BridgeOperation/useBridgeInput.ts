import { Asset } from '@force-bridge/commons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { BridgeDirection, useForceBridge } from 'state';
import { BeautyAmount } from 'suite';

export type ValidationResult = {
  bridgeInInputAmount?: string;
  bridgeOutInputAmount?: string;
  recipient?: string;
};

type ValidateStatus = 'success' | 'failed' | 'pending';

interface BridgeState {
  asset: Asset | undefined;
  setAsset: (asset: Asset) => void;

  bridgeInInputAmount: string;
  setBridgeInInputAmount: (amount: string) => void;
  bridgeOutInputAmount: string;
  // setBridgeOutAmount: (amount: string) => void

  recipient: string | undefined;
  setRecipient: (recipient: string) => void;

  fee: Asset | undefined;

  reset: () => void;
  errors: ValidationResult | undefined;
  validateStatus: ValidateStatus;
}

export function useBridgeInput(): BridgeState {
  const [asset, setAsset] = useState<Asset | undefined>();
  const [bridgeInInputAmount, setBridgeInInputAmount] = useState<string>('');
  const [bridgeOutInputAmount, setBridgeOutInputAmount] = useState<string>('');
  const [recipient, setRecipient] = useState<string | undefined>();

  const { direction, signer, nervosModule, xchainModule } = useForceBridge();

  const bridgeFeeModel = direction === BridgeDirection.In ? xchainModule.bridgeFeeModel : nervosModule.bridgeFeeModel;

  // XChain -> Nervos, validate nervos module
  // Nervos -> XChain, validate with xchain module
  const validators = direction === BridgeDirection.In ? nervosModule.validators : xchainModule.validators;

  function setInputAmount(bridgeIn: string, bridgeOut: string) {
    setBridgeInInputAmount(bridgeIn);
    setBridgeOutInputAmount(bridgeOut);
  }

  useEffect(() => {
    if (!signer) return;
    if (direction === BridgeDirection.In) setRecipient(signer.identityNervos());
    if (direction === BridgeDirection.Out) setRecipient(signer.identityXChain());
  }, [signer, direction]);

  useEffect(() => {
    setInputAmount('', '');
  }, [asset]);

  const validateAndSetBridgeInInput = useCallback(
    function validateAndSetBridgeInInput(input: string) {
      if (asset == null) return;
      if (!isValidAmountInput(input)) return;

      setInputAmount(input, input);
    },
    [asset],
  );

  const fee = useMemo<Asset | undefined>(() => {
    if (!asset) return undefined;
    const fee = asset.copy();
    fee.setAmount(bridgeFeeModel.calcBridgeFee(asset).amount);
    return fee;
  }, [asset, bridgeFeeModel]);

  const errors = useMemo<ValidationResult | undefined>(() => {
    const result: ValidationResult = {};

    if (!asset || !asset.info) {
      result.bridgeInInputAmount = 'bridge in asset is not loaded';
    } else if (signer == null) {
      result.bridgeInInputAmount = 'signer is not found, maybe wallet is disconnected';
    } else {
      const balanceLessThanInput = BeautyAmount.from(asset).val.lt(
        BeautyAmount.fromHumanize(bridgeInInputAmount, asset.info.decimals).val,
      );
      if (balanceLessThanInput) {
        result.bridgeInInputAmount = `the balance is not enough`;
      }
    }

    if (!recipient || !validators.validateUserIdent(recipient)) {
      result.recipient = 'recipient is not valid';
    }

    return Object.keys(result).length === 0 ? undefined : result;
  }, [asset, signer, bridgeInInputAmount, recipient, validators]);

  const validateStatus = !errors && bridgeInInputAmount && bridgeOutInputAmount && recipient ? 'success' : 'failed';

  const reset = useCallback(() => {
    setInputAmount('', '');
    setRecipient('');
    setAsset(undefined);
  }, []);

  return {
    asset,
    setAsset,

    bridgeInInputAmount: bridgeInInputAmount,
    setBridgeInInputAmount: validateAndSetBridgeInInput,

    bridgeOutInputAmount: bridgeOutInputAmount,

    fee,

    recipient,
    setRecipient,

    validateStatus,
    errors,
    reset,
  };
}

const INPUT_AMOUNT_REGEX = /^[0-9]*([0-9]\.)?[0-9]*$/;

export function isValidAmountInput(inputAmount: string): boolean {
  return INPUT_AMOUNT_REGEX.test(inputAmount);
}
