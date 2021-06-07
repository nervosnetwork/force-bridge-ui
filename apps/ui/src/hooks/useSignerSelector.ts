import { useMemo } from 'react';
import { createNonNilStateHook } from './helper';
import { BridgeDirection, ForceBridgeContainer } from 'containers/ForceBridgeContainer';
import { asserts } from 'errors';

interface SignerState {
  identity: string;
  identityXChain: string;
  identityNervos: string;
  sendTransaction: (tx: unknown) => Promise<{ txId: string }>;
}

/**
 * signer from fromNetwork
 */
export function useSignerSelector(): SignerState | undefined {
  const { signer, direction } = ForceBridgeContainer.useContainer();

  return useMemo(() => {
    if (!signer) return;

    const identityNervos = signer.identityNervos();
    const identityXChain = signer.identityXChain();
    const identity = BridgeDirection.In === direction ? identityXChain : identityNervos;

    function sendTransaction(tx: unknown): Promise<{ txId: string }> {
      asserts(signer != null, 'Wallet is not Connected, please check the wallet connect status');
      return Promise.resolve(signer.sendTransaction(tx));
    }

    return { identity, identityNervos, identityXChain, sendTransaction };
  }, [signer, direction]);
}

export const useConnectedSigner = createNonNilStateHook(useSignerSelector);
