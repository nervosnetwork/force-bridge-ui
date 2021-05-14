import { Asset, NERVOS_NETWORK, utils } from '@force-bridge/commons';
import { Modal } from 'antd';
import React from 'react';
import { useMutation, UseMutationResult } from 'react-query';
import { useEthereumStorage } from '../../../xchain';
import { TransactionLink } from 'components/TransactionLink';
import { boom } from 'interfaces/errors';
import { BridgeDirection, useForceBridge } from 'state';

export interface BridgeInputValues {
  asset: Asset;
  recipient: string;
}

export function useBridgeTransaction(): UseMutationResult<{ txId: string }, unknown, BridgeInputValues> {
  const { api, signer, direction, network } = useForceBridge();
  const { addTransaction } = useEthereumStorage();

  return useMutation(
    ['sendTransaction'],
    async (input: BridgeInputValues) => {
      if (!signer) boom('signer is not load');
      let generated;
      let txSummary;
      if (direction === BridgeDirection.In) {
        // TODO refactor to life-time style? beforeTransactionSending / afterTransactionSending
        generated = await api.generateBridgeInNervosTransaction({
          asset: { network: input.asset.network, ident: input.asset.ident, amount: input.asset.amount },
          recipient: input.recipient,
          sender: signer.identityXChain(),
        });
        txSummary = {
          txId: '',
          sender: signer.identityNervos(),
          timestamp: new Date().getTime(),
          fromAsset: { network: input.asset.network, ident: input.asset.ident, amount: input.asset.amount },
          toAsset: {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            network: input.asset!.shadow!.network,
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            ident: input.asset!.shadow!.ident,
            amount: input.asset.amount,
          },
        };
      } else {
        generated = await api.generateBridgeOutNervosTransaction({
          network,
          amount: input.asset.amount,
          asset: input.asset.ident,
          recipient: input.recipient,
          sender: signer.identityNervos(),
        });
        txSummary = {
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
        };
      }

      const { txId } = await signer.sendTransaction(generated.rawTransaction);
      txSummary.txId = txId;
      addTransaction(txSummary);
      return { txId: txId };
    },
    {
      onSuccess({ txId }) {
        const fromNetwork = direction === BridgeDirection.In ? network : NERVOS_NETWORK;

        Modal.success({
          title: 'Bridge Tx sent',
          content: (
            <p>
              The transaction was sent, check it in&nbsp;
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
