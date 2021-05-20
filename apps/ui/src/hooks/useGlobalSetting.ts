import { useLocalStorage } from '@rehooks/local-storage';

export type UserIdentityMode =
  | 'alwaysNervos' // Always display in Nervos address format
  | 'alwaysXChain' // Always display in XChain address format
  | 'auto'; // Display address format by bridge direction

export interface GlobalSetting {
  userIdentityMode: UserIdentityMode;
}

export function useGlobalSetting(): [GlobalSetting, (newValue: GlobalSetting) => void, () => void] {
  return useLocalStorage<GlobalSetting>('settings/user-ident', { userIdentityMode: 'auto' });
}
