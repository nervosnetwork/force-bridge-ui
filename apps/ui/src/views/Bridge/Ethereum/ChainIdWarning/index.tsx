import { Button, Modal } from 'antd';
import React from 'react';
import { useSwitchMetaMaskNetwork } from '../hooks/useSwitchMetaMaskNetwork';
import { ForceBridgeContainer } from 'containers/ForceBridgeContainer';
import { useChainId } from 'views/Bridge/Ethereum/hooks/useChainId';
import { NetworkDirectionSelector } from 'views/Header/NetworkDirectionSelector';

export const ChainIdWarning: React.FC<{ chainId: number; chainName: string }> = (props) => {
  const { chainId, chainName } = props;
  const currentChainId = useChainId();
  const { direction, switchBridgeDirection, switchNetwork, supportedNetworks } = ForceBridgeContainer.useContainer();
  const { mutateAsync: switchMetaMaskNetwork, isLoading } = useSwitchMetaMaskNetwork();

  return (
    <Modal
      title="Switch Network"
      closable={false}
      footer={false}
      visible={currentChainId != null && chainId !== currentChainId}
      width={360}
    >
      <div>
        The metamask connected network is not current bridge network({chainName}). You can switch metamask connected
        network to {chainName}, or change bridge network.
      </div>
      <div style={{ marginTop: '25px' }}>
        <Button
          loading={isLoading}
          block
          type="primary"
          onClick={() => switchMetaMaskNetwork({ chainId: `0x${chainId.toString(16)}` })}
          style={{ marginBottom: '10px' }}
        >
          Switch MetaMask Network
        </Button>

        <NetworkDirectionSelector
          networks={supportedNetworks}
          network={''}
          direction={direction}
          onSelect={({ network, direction }) => {
            switchNetwork(network);
            switchBridgeDirection(direction);
          }}
        />
      </div>
    </Modal>
  );
};
