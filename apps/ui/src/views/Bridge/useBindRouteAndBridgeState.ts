import { NERVOS_NETWORK } from '@force-bridge/commons';
import { useEffect } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';
import { BridgeDirection, useForceBridge } from 'state';

export function useBindRouteAndBridgeState(): void {
  const bridge = useForceBridge();
  const history = useHistory();
  const match = useRouteMatch<{ fromNetwork: string; toNetwork: string }>();

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

    bridge.switchBridgeDirection(BridgeDirection.In);
    bridge.switchNetwork(bridge.supportedNetworks[0]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { network, direction } = bridge;
  useEffect(() => {
    if (direction === BridgeDirection.In) {
      history.replace(`/bridge/${network}/${NERVOS_NETWORK}`);
    } else {
      history.replace(`/bridge/${NERVOS_NETWORK}/${network}`);
    }
  }, [network, direction, history]);
}
