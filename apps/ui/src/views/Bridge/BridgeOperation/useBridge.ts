import { Asset } from '@force-bridge/commons';
import { useEffect, useMemo, useState } from 'react';
import { BridgeDirection, useForceBridge } from 'state';
import { BeautyAmount } from 'suite';

type ValidationResult = {
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

  errors: ValidationResult | undefined;
  validateStatus: ValidateStatus;
}

export function useBridge(): BridgeState {
  const [asset, setAsset] = useState<Asset | undefined>();
  const [bridgeInInputAmount, setBridgeInInputAmount] = useState<string>('');
  const [bridgeOutInputAmount, setBridgeOutInputAmount] = useState<string>('');
  const [recipient, setRecipient] = useState<string | undefined>();

  const { direction, signer, nervosModule, xchainModule } = useForceBridge();

  const { bridgeFeeModel, validators } = direction === BridgeDirection.In ? xchainModule : nervosModule;

  function setInputAmount(bridgeIn: string, bridgeOut: string) {
    setBridgeInInputAmount(bridgeIn);
    setBridgeOutInputAmount(bridgeOut);
  }

  useEffect(() => {
    if (!signer) return;
    if (direction === BridgeDirection.In) setRecipient(signer.identityXChain());
    if (direction === BridgeDirection.Out) setRecipient(signer.identityNervos());
  }, [signer, direction]);

  useEffect(() => {
    setInputAmount('', '');
  }, [asset]);

  function validateAndSetBridgeInInput(input: string) {
    if (asset == null) return;
    if (!isValidAmountInput(input)) return;

    setInputAmount(input, input);
  }

  const fee = useMemo<Asset | undefined>(() => {
    if (!asset) return undefined;
    const fee = asset.copy();
    fee.setAmount(bridgeFeeModel.calcBridgeFee(asset).amount);
    return fee;
  }, [asset, bridgeFeeModel]);

  const errors = useMemo<ValidationResult | undefined>(() => {
    if (!asset || !asset.info) {
      return { bridgeInInputAmount: 'bridge in asset is not loaded' };
    }
    if (signer == null) {
      return { bridgeInInputAmount: 'signer is not found, maybe wallet is disconnected' };
    }

    const balanceLessThanInput = BeautyAmount.from(asset).val.lt(
      BeautyAmount.fromHumanize(bridgeInInputAmount, asset.info.decimals).val,
    );
    if (balanceLessThanInput) {
      return { bridgeInInputAmount: `the balance is not enough` };
    }

    if (!recipient || !validators.validateUserIdent(recipient)) {
      return { recipient: 'recipient is not valid' };
    }

    return;
  }, [asset, signer, bridgeInInputAmount, recipient, validators]);

  const validateStatus =
    !errors && !!bridgeInInputAmount && !!bridgeOutInputAmount && !!recipient ? 'success' : 'failed';

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
  };
}

const INPUT_AMOUNT_REGEX = /^[0-9]*([0-9]\.)?[0-9]*$/;

export function isValidAmountInput(inputAmount: string): boolean {
  return INPUT_AMOUNT_REGEX.test(inputAmount);
}
