import { NERVOS_NETWORK } from '@force-bridge/commons';
import { useEffect } from 'react';
import { useHistory, useLocation, useRouteMatch } from 'react-router-dom';
import { BridgeDirection, useForceBridge } from 'state';

export function useBindRouteAndBridgeState(): void {
  const bridge = useForceBridge();
  const match = useRouteMatch<{ fromNetwork: string; toNetwork: string }>();
  const location = useLocation();
  const history = useHistory();

  // first time
  useEffect(() => {
    const { fromNetwork, toNetwork } = match.params;
    if (!fromNetwork || !toNetwork) return;

    if (fromNetwork === NERVOS_NETWORK && bridge.supportedNetworks.includes(toNetwork)) {
      bridge.switchBridgeDirection(BridgeDirection.Out);
      bridge.switchNetwork(toNetwork);
      return;
    }

    if (toNetwork === NERVOS_NETWORK && bridge.supportedNetworks.includes(fromNetwork)) {
      bridge.switchBridgeDirection(BridgeDirection.In);
      bridge.switchNetwork(fromNetwork);
      return;
    }

    // bridge.switchBridgeDirection(BridgeDirection.In);
    // bridge.switchNetwork(bridge.supportedNetworks[0]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { network, direction } = bridge;
  useEffect(() => {
    const { fromNetwork, toNetwork } =
      direction === BridgeDirection.In
        ? { fromNetwork: network, toNetwork: NERVOS_NETWORK }
        : { fromNetwork: NERVOS_NETWORK, toNetwork: network };

    const newPath = location.pathname.replace(/\/bridge\/\w+\/\w+/, () => `/bridge/${fromNetwork}/${toNetwork}`);
    history.replace({ ...location, pathname: newPath });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [network, direction]);
}
