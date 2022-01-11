import { API, eth, ForceBridgeAPIV1Handler, Module, nervos, NervosNetwork } from '@force-bridge/commons';
import { useCallback, useMemo, useState } from 'react';
import { createContainer } from 'unstated-next';
import { WalletContainer, WalletState } from './WalletContainer';
import { fromEnv, Version } from './version';

const SUPPORTED_NETWORKS = ['Ethereum', 'Bsc'];

export enum BridgeDirection {
  // bridge in to nervos
  // XChain -> Nervos
  In = 'In',
  // bridge out to xchain
  // Nervos -> XChain
  Out = 'Out',
}

interface ForceBridgeState extends WalletState {
  supportedNetworks: string[];

  network: string;
  switchNetwork: (network: string) => void;

  direction: BridgeDirection;
  switchBridgeDirection: (direction?: BridgeDirection) => void;

  api: API.ForceBridgeAPIV1;

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

// TODO split into NetworkContainer, RPCContainer, ConfigContainer
export const ForceBridgeContainer = createContainer<ForceBridgeState>(() => {
  const walletState = WalletContainer.useContainer();

  const [network, switchNetwork] = useState<string>('Ethereum');
  const [direction, setDirection] = useState<BridgeDirection>(BridgeDirection.In);

  const api = useMemo<API.ForceBridgeAPIV1>(
    () =>
      network === 'Ethereum'
        ? new ForceBridgeAPIV1Handler(process.env.REACT_APP_BRIDGE_RPC_URL)
        : new ForceBridgeAPIV1Handler(process.env.REACT_APP_BRIDGE_BSC_RPC_URL),
    [network],
  );

  // TODO replace with ModuleRegistry
  const xchainModule = useMemo<Module>(() => {
    if (network === 'Ethereum' || network === 'Bsc') return eth.module as Module;
    throw new Error('unknown network');
  }, [network]);

  const switchBridgeDirection = useCallback(
    (nextDirection: BridgeDirection = direction === BridgeDirection.In ? BridgeDirection.Out : BridgeDirection.In) => {
      setDirection(nextDirection);
    },
    [direction, setDirection],
  );

  const state: ForceBridgeState = {
    ...walletState,

    supportedNetworks: SUPPORTED_NETWORKS,
    api,
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
