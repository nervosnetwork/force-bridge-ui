import { Asset, NERVOS_NETWORK, utils } from '@force-bridge/commons';
import { Modal } from 'antd';
import React from 'react';
import { useMutation, UseMutationResult } from 'react-query';
import { ApproveInfo } from '../../../xchain/eth/hooks/useAllowance';
import { TransactionLink } from 'components/TransactionLink';
import { boom } from 'interfaces/errors';
import { BridgeDirection, useForceBridge } from 'state';
import { EthWalletSigner } from 'xchain/eth/EthWalletSigner';

export interface ApproveInputValues {
  asset: Asset;
  addApprove: (approve: ApproveInfo) => void;
}

export function useApproveTransaction(): UseMutationResult<{ txId: string }, unknown, ApproveInputValues> {
  const { signer, direction, network } = useForceBridge();

  return useMutation(
    ['approveTransaction'],
    async (input: ApproveInputValues) => {
      if (!signer) boom('signer is not load');
      const txId = await (signer as EthWalletSigner).approve(input.asset.ident);
      input.addApprove({ txId: txId.txId, user: signer.identityXChain(), assetIdent: input.asset.ident });
      return txId;
    },
    {
      onSuccess({ txId }) {
        const fromNetwork = direction === BridgeDirection.In ? network : NERVOS_NETWORK;

        Modal.success({
          title: 'Approve Tx Sent',
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
        Modal.error({ title: 'Approve Tx failed', content: errorMsg, width: 360 });
      },
    },
  );
}
