import { Asset, eth, NERVOS_NETWORK, utils } from '@force-bridge/commons';
import { Modal } from 'antd';
import React from 'react';
import { useMutation, UseMutationResult } from 'react-query';
import { TransactionLink } from 'components/TransactionLink';
import { boom } from 'interfaces/errors';
import { BridgeDirection, useForceBridge } from 'state';
import { EthWalletSigner } from 'xchain/eth/EthWalletSigner';

export interface BridgeInputValues {
  asset: Asset;
  recipient: string;
}

async function checkAllowance(signer: EthWalletSigner, input: BridgeInputValues) {
  const ethSigner = signer;

  const isAllowanceEnough = await ethSigner
    .getAllowance(input.asset.ident)
    .then((allowance) => allowance.gte(input.asset.amount));

  if (!isAllowanceEnough) {
    const confirmed = window.confirm(
      'The allowance is not enough for bridging, we need to approve before we can execute the Bridge operation',
    );
    if (!confirmed) {
      boom('Not yet approved, we need to approve before we can execute the Bridge operation');
    }

    await ethSigner.approve(input.asset.ident);
    boom('Waiting for the approving successfully');
  }
}

export function useBridgeTransaction(): UseMutationResult<{ txId: string }, unknown, BridgeInputValues> {
  const { api, signer, direction, network } = useForceBridge();

  return useMutation(
    ['sendTransaction'],
    async (input: BridgeInputValues) => {
      if (!signer) boom('signer is not load');
      let generated;
      if (direction === BridgeDirection.In) {
        // TODO refactor to life-time style? beforeTransactionSending / afterTransactionSending
        if (network === 'Ethereum' && eth.module.assetModel.isDerivedAsset(input.asset)) {
          await checkAllowance(signer as EthWalletSigner, input);
        }

        generated = await api.generateBridgeInNervosTransaction({
          asset: { network: input.asset.network, ident: input.asset.ident, amount: input.asset.amount },
          recipient: input.recipient,
          sender: signer.identityXChain(),
        });
      } else {
        generated = await api.generateBridgeOutNervosTransaction({
          network,
          amount: input.asset.amount,
          asset: input.asset.ident,
          recipient: input.recipient,
          sender: signer.identityNervos(),
        });
      }

      return signer.sendTransaction(generated.rawTransaction);
    },
    {
      onSuccess({ txId }) {
        const fromNetwork = direction === BridgeDirection.In ? network : NERVOS_NETWORK;

        Modal.success({
          title: 'Tx sent',
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
