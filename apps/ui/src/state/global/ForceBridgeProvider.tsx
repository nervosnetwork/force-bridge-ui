import { API } from '@force-bridge/commons';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { GlobalSetting, useGlobalSetting } from './setting';
import { ConnectStatus, TwoWaySigner, Wallet } from 'interfaces/WalletConnector';
import { createDummyAPI } from 'suite/apiv1';
import { DummyWallet } from 'xchain/dummy/DummyWallet';

interface ForceBridgeState {
  api: API.ForceBridgeAPIV1;
  wallet: Wallet;
  globalSetting: GlobalSetting;
  walletConnectStatus: ConnectStatus;
  signer: TwoWaySigner | undefined;
}

const Context = createContext<ForceBridgeState | null>(null);

export const ForceBridgeProvider: React.FC = (props) => {
  const api = useMemo<API.ForceBridgeAPIV1>(() => createDummyAPI(), []);
  const wallet = useMemo<Wallet>(() => new DummyWallet(), []);

  const [globalSetting] = useGlobalSetting();
  const [signer, setSigner] = useState<TwoWaySigner | undefined>();
  const [walletConnectStatus, setWalletConnectStatus] = useState<ConnectStatus>(ConnectStatus.Disconnected);

  useEffect(() => {
    wallet.on('signerChanged', setSigner);
    wallet.on('connectStatusChanged', setWalletConnectStatus);
  }, [wallet]);

  return (
    <Context.Provider value={{ api, wallet, globalSetting, signer, walletConnectStatus }}>
      {props.children}
    </Context.Provider>
  );
};

export function useForceBridge(): ForceBridgeState {
  const context = useContext(Context);
  if (!context) throw new Error('useForceBridge must be used in component which wrapped by <ForceBridgeProvider>');

  return context;
}
