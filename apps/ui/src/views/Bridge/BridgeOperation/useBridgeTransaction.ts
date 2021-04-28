import { Asset } from '@force-bridge/commons';
import { useMutation, UseMutationResult } from 'react-query';
import { boom } from 'interfaces/errors';
import { BridgeDirection, useForceBridge } from 'state';

export interface BridgeInputValues {
  asset: Asset;
  recipient: string;
}

export function useBridgeTransaction(): UseMutationResult<{ txId: string }, unknown, BridgeInputValues> {
  const { api, signer, direction, network } = useForceBridge();

  return useMutation(['sendTransaction'], async (input: BridgeInputValues) => {
    if (!signer) boom('signer is not load');

    const generated = await (direction === BridgeDirection.In
      ? api.generateBridgeInNervosTransaction({
          asset: { network: input.asset.network, ident: input.asset.ident, amount: input.asset.amount },
          recipient: input.recipient,
          sender: signer.identityXChain(),
        })
      : api.generateBridgeOutNervosTransaction({
          network,
          asset: input.asset.ident,
          recipient: input.recipient,
          sender: signer.identityNervos(),
        }));

    return signer.sendTransaction(generated.rawTransaction);
  });
}
