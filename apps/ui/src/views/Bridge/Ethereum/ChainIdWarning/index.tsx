import { Modal, Typography } from 'antd';
import React from 'react';
import { useChainId } from 'views/Bridge/Ethereum/hooks/useChainId';

export const ChainIdWarning: React.FC<{ chainId: number; chainName: string }> = (props) => {
  const { chainId, chainName } = props;
  const currentChainId = useChainId();

  return (
    <Modal closable={false} footer={false} visible={currentChainId != null && chainId !== currentChainId} width={360}>
      <Typography.Text type="warning">Warning</Typography.Text> Only {chainName} Network is supported. Please connect
      your wallet to {chainName} Network.
    </Modal>
  );
};
