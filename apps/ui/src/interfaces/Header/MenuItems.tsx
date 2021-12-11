import { ClockIcon, SwitchHorizontalIcon } from '@heroicons/react/outline';
import { ChevronDownIcon } from '@heroicons/react/solid';

export const menuItems = [
  { name: 'Transfer', icon: <SwitchHorizontalIcon /> },
  { name: 'History', icon: <ClockIcon /> },
  {
    name: 'More',
    icon: <ChevronDownIcon />,
  },
];
