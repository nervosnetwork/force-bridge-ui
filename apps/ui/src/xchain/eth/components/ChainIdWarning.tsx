import { Modal, Typography } from 'antd';
import React from 'react';
import { useChainId } from '../hooks/useChainId';

export const ChainIdWarning: React.FC<{ chainId: number; chainName: string }> = (props) => {
  const { chainId, chainName } = props;
  const currentChainId = useChainId();

  return (
    <Modal closable={false} footer={false} visible={currentChainId != null && chainId !== currentChainId} width={360}>
      <Typography.Text type="warning">Warning</Typography.Text> Only {chainName} Network is supported at this stage.
      Please connect your Ethereum wallet to
      {chainName} Network.
    </Modal>
  );
};
