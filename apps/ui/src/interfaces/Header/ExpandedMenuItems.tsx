import {
  BookOpenIcon,
  ClockIcon,
  CodeIcon,
  InformationCircleIcon,
  SwitchHorizontalIcon,
} from '@heroicons/react/outline';
import { SvgIconProps } from '@mui/material';

export interface IMenuItems {
  name: string;
  description: string;
  href: string;
  target: string;
  icon: React.ReactElement<SvgIconProps>;
  isDesktop: boolean;
}

export const expandedMenuItems = [
  {
    name: 'User Guide',
    description: 'Get started with Force Bridge',
    href: 'https://github.com/nervosnetwork/force-bridge/blob/main/docs/dapp-user-guide.md',
    target: '_blank',
    icon: <BookOpenIcon />,
    isDesktop: true,
  },
  {
    name: 'Github',
    description: 'View the Force Bridge codebase',
    href: 'https://github.com/nervosnetwork/force-bridge',
    target: '_blank',
    icon: <CodeIcon />,
    isDesktop: true,
  },
  {
    name: 'About',
    description: 'Learn more about Nervos',
    href: 'https://www.nervos.org/about/',
    target: '_blank',
    icon: <InformationCircleIcon />,
    isDesktop: true,
  },
  {
    name: 'Transfer',
    description: 'View the Force Bridge codebase',
    href: 'https://github.com/nervosnetwork/force-bridge',
    target: '_blank',
    icon: <SwitchHorizontalIcon />,
    isDesktop: false,
  },
  {
    name: 'History',
    description: 'Learn more about Nervos',
    href: 'https://www.nervos.org/about/',
    target: '_blank',
    icon: <ClockIcon />,
    isDesktop: false,
  },
];
