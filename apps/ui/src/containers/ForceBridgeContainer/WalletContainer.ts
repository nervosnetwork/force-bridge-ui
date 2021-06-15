import { useEffect, useState } from 'react';
import { createContainer } from 'unstated-next';
import { ConnectStatus, TwoWaySigner, Wallet } from 'interfaces/WalletConnector';

export interface WalletState {
  walletConnectStatus: ConnectStatus;
  wallet: Wallet | undefined;
  signer: TwoWaySigner | undefined;
  setWallet: (wallet: Wallet | undefined) => void;
}

export const WalletContainer = createContainer<WalletState>(() => {
  const [walletConnectStatus, setWalletConnectStatus] = useState<ConnectStatus>(ConnectStatus.Disconnected);
  const [wallet, setWallet] = useState<Wallet>();
  const [signer, setSigner] = useState<TwoWaySigner>();

  useEffect(() => {
    if (!wallet) return;
    wallet.on('signerChanged', setSigner);
    wallet.on('connectStatusChanged', setWalletConnectStatus);
  }, [wallet]);

  return {
    walletConnectStatus,
    signer,
    wallet,
    setWallet,
  };
});
