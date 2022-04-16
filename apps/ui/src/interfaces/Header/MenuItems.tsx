import { ClockIcon, SwitchHorizontalIcon } from '@heroicons/react/outline';
import { ChevronDownIcon } from '@heroicons/react/solid';

export enum ETransfer {
  TRANSFER = 'TRANSFER',
  HISTORY = 'HISTORY',
  MORE = 'MORE',
}

export const menuItems = [
  { name: 'Transfer', value: ETransfer.TRANSFER, icon: <SwitchHorizontalIcon /> },
  { name: 'History', value: ETransfer.HISTORY, icon: <ClockIcon /> },
  {
    name: 'More',
    value: ETransfer.MORE,
    icon: <ChevronDownIcon />,
  },
];
