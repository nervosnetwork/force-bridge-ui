import { useHistory, useLocation } from 'react-router-dom';

interface BridgeParams {
  setParams(isBridge: string): void;
}

export function useBridgeParams(): BridgeParams {
  const history = useHistory();
  const location = useLocation();

  const setParams = (isBridge: string) => {
    const params = new URLSearchParams(location.search);
    params.set('isBridge', isBridge);
    history.replace({ search: params.toString() });
  };

  return { setParams };
}
