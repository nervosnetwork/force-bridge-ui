import { Asset } from '@force-bridge/commons';
import { useCallback, useState } from 'react';
import { createContainer } from 'unstated-next';

interface BridgeOperationFormState {
  asset: Asset | undefined;
  setAsset: (asset: undefined | Asset) => void;

  recipient: string;
  setRecipient: (recipient: string) => void;

  bridgeInAmount: string;
  setBridgeInAmount: (amount: string) => void;

  bridgeOutAmount: string;
  setBridgeOutAmount: (amount: string) => void;
}

const INPUT_AMOUNT_REGEX = /^[0-9]*([0-9]\.)?[0-9]*$/;

export function isValidAmountInput(inputAmount: string): boolean {
  return INPUT_AMOUNT_REGEX.test(inputAmount);
}

export const BridgeOperationFormContainer = createContainer<BridgeOperationFormState>(() => {
  const [asset, setAsset] = useState<Asset | undefined>();
  const [recipient, setRecipient] = useState<string>('');
  const [bridgeInAmount, setBridgeInAmount] = useState<string>('');
  const [bridgeOutAmount, setBridgeOutAmount] = useState<string>('');

  const checkAndSetBridgeInAmount = useCallback((input: string) => {
    if (isValidAmountInput(input)) setBridgeInAmount(input);
  }, []);

  const checkAndSetBridgeOutAmount = useCallback((input: string) => {
    if (isValidAmountInput(input)) setBridgeOutAmount(input);
  }, []);

  return {
    asset,
    setAsset,
    recipient,
    setRecipient,
    bridgeInAmount,
    setBridgeInAmount: checkAndSetBridgeInAmount,
    bridgeOutAmount,
    setBridgeOutAmount: checkAndSetBridgeOutAmount,
  };
});
