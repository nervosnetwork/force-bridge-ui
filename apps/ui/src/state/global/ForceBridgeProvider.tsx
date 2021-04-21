import { API, XChainNetwork } from '@force-bridge/commons';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { GlobalSetting, useGlobalSetting } from './setting';
import { ConnectStatus, TwoWaySigner, Wallet } from 'interfaces/WalletConnector';
import { createDummyAPI } from 'suite/dummy/apiv1';
import { DummyWallet } from 'xchain/dummy/DummyWallet';

export enum BridgeDirection {
  // bridge in to nervos
  // XChain -> Nervos
  In = 'In',
  // bridge out to xchain
  // Nervos -> XChain
  Out = 'Out',
}

interface ForceBridgeState {
  globalSetting: GlobalSetting;

  network: XChainNetwork['Network'];
  setNetwork: (network: XChainNetwork['Network']) => void;

  direction: BridgeDirection;
  setDirection: (direction: BridgeDirection) => void;

  api: API.ForceBridgeAPIV1;
  walletConnectStatus: ConnectStatus;
  wallet: Wallet;
  signer: TwoWaySigner | undefined;
}

const Context = createContext<ForceBridgeState | null>(null);

export const ForceBridgeProvider: React.FC = (props) => {
  const api = useMemo<API.ForceBridgeAPIV1>(() => createDummyAPI(), []);
  const wallet = useMemo<Wallet>(() => new DummyWallet(), []);

  const [globalSetting] = useGlobalSetting();

  const [network, setNetwork] = useState<XChainNetwork['Network']>('Ethereum');
  const [direction, setDirection] = useState<BridgeDirection>(BridgeDirection.In);

  const [signer, setSigner] = useState<TwoWaySigner | undefined>();
  const [walletConnectStatus, setWalletConnectStatus] = useState<ConnectStatus>(ConnectStatus.Disconnected);

  useEffect(() => {
    wallet.on('signerChanged', setSigner);
    wallet.on('connectStatusChanged', setWalletConnectStatus);
  }, [wallet]);

  const state: ForceBridgeState = {
    api,
    wallet,
    globalSetting,
    signer,
    walletConnectStatus,
    setDirection,
    setNetwork,
    network,
    direction,
  };

  return <Context.Provider value={state}>{props.children}</Context.Provider>;
};

export function useForceBridge(): ForceBridgeState {
  const context = useContext(Context);
  if (!context) throw new Error('useForceBridge must be used in component which wrapped by <ForceBridgeProvider>');

  return context;
}
