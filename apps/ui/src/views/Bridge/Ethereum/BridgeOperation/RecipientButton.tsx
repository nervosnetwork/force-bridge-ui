import { Button, Tooltip } from 'antd';
import React from 'react';
import { toGodwokenAddress } from './utils';
import { BridgeDirection } from 'containers/ForceBridgeContainer';
import { TwoWaySigner } from 'interfaces/WalletConnector';

interface RecipientButtonProps {
  setRecipient: (recipient: string) => void;
  signer: TwoWaySigner;
  direction: BridgeDirection;
}

export const RecipientButton: React.FC<RecipientButtonProps> = (props) => {
  const { setRecipient, signer, direction } = props;

  if (direction === BridgeDirection.In) {
    return (
      <>
        <Tooltip title={'Pw ckb address'}>
          <Button type="link" size="small" onClick={() => setRecipient(signer.identityNervos())}>
            Pw
          </Button>
        </Tooltip>
        <Tooltip title={'Godwoken deposit ckb address'}>
          <Button type="link" size="small" onClick={() => setRecipient(toGodwokenAddress(signer.identityXChain()))}>
            Godwoken
          </Button>
        </Tooltip>
      </>
    );
  }

  return (
    <>
      <Tooltip title={'Ethereum address related to pw ckb address'}>
        <Button type="link" size="small" onClick={() => setRecipient(signer.identityXChain())}>
          Pw
        </Button>
      </Tooltip>
    </>
  );
};
