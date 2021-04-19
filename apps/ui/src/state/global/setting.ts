import { useLocalStorage } from '@rehooks/local-storage';

export type UserIdentityMode = 'alwaysNervos' | 'alwaysXChain' | 'auto';

export interface GlobalSetting {
  userIdentityMode: UserIdentityMode;
}

export function useGlobalSetting(): [GlobalSetting, (newValue: GlobalSetting) => void, () => void] {
  return useLocalStorage<GlobalSetting>('globalSetting', { userIdentityMode: 'alwaysNervos' });
}
