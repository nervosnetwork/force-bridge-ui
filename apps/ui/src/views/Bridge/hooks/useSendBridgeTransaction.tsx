import { Asset, NERVOS_NETWORK, utils } from '@force-bridge/commons';
import { Modal } from 'antd';
import React from 'react';
import { useMutation, UseMutationResult } from 'react-query';
import { TransactionLink } from 'components/TransactionLink';
import { BridgeDirection, ForceBridgeContainer } from 'containers/ForceBridgeContainer';
import { boom } from 'errors';
import { useSentTransactionStorage } from 'hooks/useSentTransactionStorage';

export interface BridgeInputValues {
  asset: Asset;
  recipient: string;
}

export function useSendBridgeTransaction(): UseMutationResult<{ txId: string }, unknown, BridgeInputValues> {
  const { api, signer, network, direction } = ForceBridgeContainer.useContainer();
  const { addTransaction } = useSentTransactionStorage();
  // FIXME use network from ForceBridgeContainer if backend support
  const ethereumNetwork = 'Ethereum';

  return useMutation(
    ['sendTransaction'],
    async (input: BridgeInputValues) => {
      if (!signer) boom('signer is not load');
      let generated;
      let txToCache;
      if (direction === BridgeDirection.In) {
        // TODO refactor to life-time style? beforeTransactionSending / afterTransactionSending
        generated = await api.generateBridgeInNervosTransaction({
          asset: { network: input.asset.network, ident: input.asset.ident, amount: input.asset.amount },
          recipient: input.recipient,
          sender: signer.identityXChain(),
        });
        txToCache = {
          txId: '',
          sender: signer.identityXChain(),
          timestamp: new Date().getTime(),
          fromAsset: { network: input.asset.network, ident: input.asset.ident, amount: input.asset.amount },
          toAsset: {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            network: input.asset!.shadow!.network,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            ident: input.asset!.shadow!.ident,
            amount: input.asset.amount,
          },
          rawTx: generated.rawTransaction,
        };
      } else {
        generated = await api.generateBridgeOutNervosTransaction({
          network: ethereumNetwork,
          amount: input.asset.amount,
          asset: input.asset.ident,
          recipient: input.recipient,
          sender: signer.identityNervos(),
        });
        txToCache = {
          txId: '',
          sender: signer.identityNervos(),
          timestamp: new Date().getTime(),
          toAsset: { network: input.asset.network, ident: input.asset.ident, amount: input.asset.amount },
          fromAsset: {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            network: input.asset!.shadow!.network,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            ident: input.asset!.shadow!.ident,
            amount: input.asset.amount,
          },
          rawTx: generated.rawTransaction,
        };
      }

      const { txId } = await signer.sendTransaction(generated.rawTransaction);
      txToCache.txId = txId;
      addTransaction(txToCache);
      return { txId: txId };
    },
    {
      onSuccess({ txId }) {
        const fromNetwork = direction === BridgeDirection.In ? network : NERVOS_NETWORK;

        Modal.success({
          title: 'Bridge Tx sent',
          content: (
            <p>
              The transaction has been sent, check it in&nbsp;
              <TransactionLink network={fromNetwork} txId={txId}>
                explorer
              </TransactionLink>
              <details>
                <summary>transaction id</summary>
                {txId}
              </details>
            </p>
          ),
        });
      },
      onError(error) {
        const errorMsg: string = utils.hasProp(error, 'message') ? String(error.message) : 'Unknown error';
        Modal.error({ title: 'Tx failed', content: errorMsg, width: 360 });
      },
    },
  );
}
