import { useCallback, useMemo, useState } from 'react';
import { useBridgeFeeQuery } from './useBridgeFeeQuery';
import { BridgeOperationFormContainer } from 'containers/BridgeOperationFormContainer';
import { BridgeDirection, ForceBridgeContainer } from 'containers/ForceBridgeContainer';
import { useSignerSelector } from 'hooks/useSignerSelector';
import { BeautyAmount } from 'libs';

export type ValidateResult = {
  bridgeInInputAmount?: string;
  bridgeOutInputAmount?: string;
  recipient?: string;
};

type ValidateStatus = 'init' | 'success' | 'failed' | 'pending';

interface BridgeOperationValidation {
  reset: () => void;
  validate: () => void;
  status: ValidateStatus;
  result: ValidateResult | undefined;
}

function checkDecimals(input: string, decimals: number): boolean {
  return BeautyAmount.fromHumanize(input || '0', decimals).val.decimalPlaces() === 0;
}

export function useValidateInput(): () => ValidateResult | undefined {
  const { direction, xchainModule, nervosModule } = ForceBridgeContainer.useContainer();
  const { bridgeFromAmount, recipient, asset } = BridgeOperationFormContainer.useContainer();
  const signer = useSignerSelector();

  const validators = direction === BridgeDirection.In ? nervosModule.validators : xchainModule.validators;

  return useCallback(() => {
    const result: ValidateResult = {};

    if (!asset || !asset.info) {
      result.bridgeInInputAmount = 'bridge assets is not loaded';
    } else if (signer == null) {
      result.bridgeInInputAmount = 'signer is not found, maybe wallet is disconnected';
    } else if (!checkDecimals(bridgeFromAmount, asset.info.decimals)) {
      result.bridgeInInputAmount = `max decimal places should be less than ${asset.info.decimals}`;
    } else {
      const inputAmount = BeautyAmount.fromHumanize(bridgeFromAmount || '0', asset.info.decimals);
      if (inputAmount.val.lte(0)) {
        result.bridgeInInputAmount = 'bridge in amount should large than 0';
      }

      const userAmount = BeautyAmount.from(asset);
      const balanceLessThanInput = userAmount.val.lt(inputAmount.val);
      if (balanceLessThanInput) {
        result.bridgeInInputAmount = `balance is insufficient`;
      }
    }

    if (!recipient || !validators.validateUserIdent(recipient)) {
      result.recipient = 'recipient is not valid';
    }

    if (Object.keys(result).length === 0) return undefined;
    return result;
  }, [asset, bridgeFromAmount, recipient, signer, validators]);
}

export function useValidateBridgeOperationForm(): BridgeOperationValidation {
  const [validateResult, setValidateResult] = useState<ValidateResult | undefined>();

  const feeQuery = useBridgeFeeQuery();
  const validateInput = useValidateInput();

  const validate = useCallback(() => {
    const validateInputResult = validateInput();
    if (!validateInputResult && !feeQuery.error) {
      return setValidateResult(undefined);
    }

    const validateResult: ValidateResult = {};
    if (validateInputResult?.bridgeInInputAmount) {
      validateResult.bridgeInInputAmount = validateInputResult.bridgeInInputAmount;
    }
    if (validateInputResult?.bridgeOutInputAmount) {
      validateResult.bridgeOutInputAmount = validateInputResult.bridgeOutInputAmount;
    }
    if (validateInputResult?.recipient) {
      validateResult.recipient = validateInputResult.recipient;
    }
    if (!validateInputResult?.bridgeInInputAmount && feeQuery.error?.message) {
      validateResult.bridgeInInputAmount = feeQuery.error?.message;
    }

    setValidateResult(validateResult);
  }, [validateInput, feeQuery.error]);

  const reset = useCallback(() => {
    setValidateResult(undefined);
  }, []);

  const validateStatus = useMemo<ValidateStatus>(() => {
    if (feeQuery.status === 'idle') return 'init';
    if (feeQuery.status === 'loading') return 'pending';

    if (feeQuery.status === 'error' || validateResult != null) return 'failed';

    return 'success';
  }, [feeQuery.status, validateResult]);

  return {
    reset,
    validate,
    result: validateResult,
    status: validateStatus,
  };
}
