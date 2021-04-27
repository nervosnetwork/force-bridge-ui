import { Asset } from '@force-bridge/commons';
import { useMutation, UseMutationResult } from 'react-query';
import { boom } from 'interfaces/errors';
import { BridgeDirection, useForceBridge } from 'state';

export interface BridgeInputValues {
  asset: Asset;
  recipient: string;
}

export function useBridgeTransaction(): UseMutationResult<{ txId: string }, unknown, BridgeInputValues> {
  const { api, signer, direction } = useForceBridge();

  return useMutation(['sendTransaction'], async (input: BridgeInputValues) => {
    if (!signer) boom('signer is not load');

    const generated = await (direction === BridgeDirection.In
      ? api.generateBridgeInNervosTransaction({
          asset: input.asset,
          recipient: input.recipient,
          sender: signer.identityXChain(),
        })
      : api.generateBridgeInNervosTransaction({
          asset: input.asset,
          recipient: input.recipient,
          sender: signer.identityNervos(),
        }));

    return signer.sendTransaction(generated.rawTransaction);
  });
}
