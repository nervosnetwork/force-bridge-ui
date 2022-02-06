import { NERVOS_NETWORK } from '@force-bridge/commons';
import { useHistory, useLocation } from 'react-router-dom';
import { BridgeDirection, ForceBridgeContainer } from 'containers/ForceBridgeContainer';

interface BridgePath {
  setPath(view: string): void;
}

export function useBridgePath(): BridgePath {
  const history = useHistory();
  const location = useLocation();
  const bridge = ForceBridgeContainer.useContainer();

  const { network, direction } = bridge;
  const { fromNetwork, toNetwork } =
    direction === BridgeDirection.In
      ? { fromNetwork: network, toNetwork: NERVOS_NETWORK }
      : { fromNetwork: NERVOS_NETWORK, toNetwork: network };

  const setPath = (view: string) => {
    const params = new URLSearchParams(location.search);
    if (view === 'transfer') {
      history.replace({ pathname: `/bridge/${fromNetwork}/${toNetwork}`, search: params.toString() });
    } else {
      history.replace({ pathname: `/history`, search: params.toString() });
    }
  };

  return { setPath };
}
