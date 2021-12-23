import { Asset, NERVOS_NETWORK, utils } from '@force-bridge/commons';
import { Modal } from 'antd';
import React from 'react';
import { useMutation, UseMutationResult } from 'react-query';
import { TransactionLink } from 'components/TransactionLink';
import { BridgeDirection, ForceBridgeContainer } from 'containers/ForceBridgeContainer';
import { boom } from 'errors';
import { ApproveInfo } from 'views/Bridge/Ethereum/hooks/useAllowance';
import { EthWalletSigner } from 'xchain/eth/EthWalletSigner';

export interface ApproveInputValues {
  asset: Asset;
  addApprove: (approve: ApproveInfo) => void;
}

export function useApproveTransaction(): UseMutationResult<{ txId: string }, unknown, ApproveInputValues> {
  const { signer, direction, network } = ForceBridgeContainer.useContainer();

  return useMutation(
    ['approveTransaction'],
    async (input: ApproveInputValues) => {
      if (!signer) boom('signer is not load');

      const txId = await (signer as EthWalletSigner).approve(input.asset.ident);
      input.addApprove({ txId: txId.txId, network, user: signer.identityXChain(), assetIdent: input.asset.ident });
      return txId;
    },
    {
      onSuccess({ txId }) {
        const fromNetwork = direction === BridgeDirection.In ? network : NERVOS_NETWORK;

        Modal.success({
          title: 'Approve Tx Sent',
          content: (
            <div>
              The transaction has been sent, check it in&nbsp;
              <TransactionLink network={fromNetwork} txId={txId}>
                explorer
              </TransactionLink>
              <details>
                <summary>transaction id</summary>
                {txId}
              </details>
            </div>
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
