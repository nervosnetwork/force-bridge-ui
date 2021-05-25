import { Asset } from '@force-bridge/commons';
import { useCallback, useState } from 'react';
import { createContainer } from 'unstated-next';

interface BridgeOperationFormState {
  asset: Asset | undefined;
  setAsset: (asset: undefined | Asset) => void;

  recipient: string;
  setRecipient: (recipient: string) => void;

  bridgeFromAmount: string;
  setBridgeFromAmount: (amount: string) => void;

  bridgeToAmount: string;
  setBridgeToAmount: (amount: string) => void;
}

const INPUT_AMOUNT_REGEX = /^[0-9]*([0-9]\.)?[0-9]*$/;

export function isValidAmountInput(inputAmount: string): boolean {
  return INPUT_AMOUNT_REGEX.test(inputAmount);
}

export const BridgeOperationFormContainer = createContainer<BridgeOperationFormState>(() => {
  const [asset, setAsset] = useState<Asset | undefined>();
  const [recipient, setRecipient] = useState<string>('');
  const [bridgeFromAmount, setBridgeInAmount] = useState<string>('');
  const [bridgeToAmount, setBridgeOutAmount] = useState<string>('');

  const checkAndSetBridgeFromAmount = useCallback((input: string) => {
    if (isValidAmountInput(input)) setBridgeInAmount(input);
  }, []);

  const checkAndSetBridgeToAmount = useCallback((input: string) => {
    if (isValidAmountInput(input)) setBridgeOutAmount(input);
  }, []);

  return {
    asset,
    setAsset,
    recipient,
    setRecipient,
    bridgeFromAmount: bridgeFromAmount,
    setBridgeFromAmount: checkAndSetBridgeFromAmount,
    bridgeToAmount: bridgeToAmount,
    setBridgeToAmount: checkAndSetBridgeToAmount,
  };
});
