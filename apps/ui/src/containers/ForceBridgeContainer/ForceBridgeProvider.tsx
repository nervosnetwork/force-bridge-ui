import { API, eth, ForceBridgeAPIV1Handler, Module, nervos, NervosNetwork } from '@force-bridge/commons';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { createContainer } from 'unstated-next';
import { fromEnv, Version } from 'containers/ForceBridgeContainer/version';
import { ConnectStatus, TwoWaySigner, Wallet } from 'interfaces/WalletConnector';
import { EthereumWalletConnector } from 'xchain/eth';

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
  supportedNetworks: string[];

  network: string;
  switchNetwork: (network: string) => void;

  direction: BridgeDirection;
  switchBridgeDirection: (direction?: BridgeDirection) => void;

  api: API.ForceBridgeAPIV1;
  walletConnectStatus: ConnectStatus;
  wallet: Wallet;
  signer: TwoWaySigner | undefined;

  /**
   * @deprecated
   */
  xchainModule: Module;
  /**
   * @deprecated
   */
  nervosModule: Module<NervosNetwork>;

  version: Version;
}

// TODO split into WalletContainer, NetworkContainer, RCPContainer, ConfigContainer
export const ForceBridgeContainer = createContainer<ForceBridgeState>(() => {
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

  const [network, switchNetwork] = useState<string>('Ethereum');
  const [direction, setDirection] = useState<BridgeDirection>(BridgeDirection.In);

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

  const switchBridgeDirection = useCallback(
    (nextDirection: BridgeDirection = direction === BridgeDirection.In ? BridgeDirection.Out : BridgeDirection.In) => {
      setDirection(nextDirection);
    },
    [direction, setDirection],
  );

  const state: ForceBridgeState = {
    supportedNetworks: SUPPORTED_NETWORKS,
    api,
    wallet,
    signer,
    walletConnectStatus,
    switchBridgeDirection,
    switchNetwork,
    network,
    direction,
    xchainModule: xchainModule,
    nervosModule: nervos.module,
    version: fromEnv(),
  };

  return state;
});
