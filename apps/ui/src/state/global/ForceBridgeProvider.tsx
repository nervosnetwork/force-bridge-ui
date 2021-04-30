import { API, eth, ForceBridgeAPIV1Handler, Module, nervos, NervosNetwork } from '@force-bridge/commons';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { GlobalSetting, useGlobalSetting } from './setting';
import { ConnectStatus, TwoWaySigner, Wallet } from 'interfaces/WalletConnector';
import { EthereumWalletConnector } from 'xchain/eth/EthereumWalletConnector';

const SUPPORTED_NETWORKS = ['Ethereum'];

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
  supportedNetworks: string[];

  network: string;
  switchNetwork: (network: string) => void;

  direction: BridgeDirection;
  switchBridgeDirection: (direction: BridgeDirection) => void;

  api: API.ForceBridgeAPIV1;
  walletConnectStatus: ConnectStatus;
  wallet: Wallet;
  signer: TwoWaySigner | undefined;

  xchainModule: Module;
  nervosModule: Module<NervosNetwork>;
}

const Context = createContext<ForceBridgeState | null>(null);

export const ForceBridgeProvider: React.FC = (props) => {
  const api = useMemo<API.ForceBridgeAPIV1>(
    () => new ForceBridgeAPIV1Handler(process.env.REACT_APP_BRIDGE_RPC_URL),
    [],
  );

  const wallet = useMemo<Wallet>(
    // TODO refactor with MultiChainWalletConnector
    // TODO extract ckbChainId to env config
    () => new EthereumWalletConnector({ ckbRpcUrl: process.env.REACT_APP_CKB_RPC_URL, ckbChainID: 1 }),
    [],
  );

  const [globalSetting] = useGlobalSetting();

  const [network, switchNetwork] = useState<string>('Ethereum');
  const [direction, switchBridgeDirection] = useState<BridgeDirection>(BridgeDirection.In);

  const [signer, setSigner] = useState<TwoWaySigner | undefined>();
  const [walletConnectStatus, setWalletConnectStatus] = useState<ConnectStatus>(ConnectStatus.Disconnected);

  // TODO replace with ModuleRegistry
  const xchainModule = useMemo<Module>(() => {
    if (network === 'Ethereum') return eth.module as Module;
    throw new Error('unknown network');
  }, [network]);

  useEffect(() => {
    wallet.on('signerChanged', setSigner);
    wallet.on('connectStatusChanged', setWalletConnectStatus);
  }, [wallet]);

  const state: ForceBridgeState = {
    supportedNetworks: SUPPORTED_NETWORKS,
    api,
    wallet,
    globalSetting,
    signer,
    walletConnectStatus,
    switchBridgeDirection,
    switchNetwork,
    network,
    direction,
    xchainModule: xchainModule,
    nervosModule: nervos.module,
  };

  return <Context.Provider value={state}>{props.children}</Context.Provider>;
};

export function useForceBridge(): ForceBridgeState {
  const context = useContext(Context);
  if (!context) throw new Error('useForceBridge must be used in component which wrapped by <ForceBridgeProvider>');

  return context;
}
