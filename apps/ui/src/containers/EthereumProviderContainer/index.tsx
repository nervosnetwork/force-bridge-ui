import { Modal } from 'antd';
import { providers } from 'ethers';
import React from 'react';
import { createContainer } from 'unstated-next';

export const EthereumProviderContainer = createContainer<providers.Web3Provider>(() => {
  const ethereum = window.ethereum;

  if (!ethereum) {
    Modal.warning({
      content: (
        <div>
          <a href="https://metamask.io/" target="_blank" rel="noreferrer">
            MetaMask
          </a>
          &nbsp;is required when doing the bridge of Ethereum
        </div>
      ),
    });

    throw new Error('Metamask is required');
  }

  return new providers.Web3Provider(ethereum);
});
