import Icon, { QuestionOutlined } from '@ant-design/icons';
import { AntdIconProps } from '@ant-design/icons/lib/components/AntdIcon';
import React from 'react';
import { Icons } from './icons';

interface NetworkIconProps extends AntdIconProps {
  network: string;
}

export const NetworkIcon = React.forwardRef<HTMLSpanElement, NetworkIconProps>((props, ref) => {
  const { network, ...iconProps } = props;

  const SvgIcon: React.FC = network in Icons ? Icons[network] : QuestionOutlined;

  return <Icon {...iconProps} ref={ref} component={SvgIcon} />;
});
