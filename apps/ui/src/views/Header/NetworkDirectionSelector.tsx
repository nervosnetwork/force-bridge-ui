import { NERVOS_NETWORK } from '@force-bridge/commons';
import { Dropdown, Menu } from 'antd';
import React, { useMemo } from 'react';
import { NetworkDirection } from 'components/Network';
import { LinearGradientButton } from 'components/Styled';
import { BridgeDirection } from 'containers/ForceBridgeContainer';

interface NetworkDirectionSelectorProps {
  networks: string[];
  network: string;
  direction: BridgeDirection;
  onSelect: (config: { network: string; direction: BridgeDirection }) => void;
}

export const NetworkDirectionSelector: React.FC<NetworkDirectionSelectorProps> = (props) => {
  const { network, direction, networks, onSelect } = props;

  const selected = useMemo(() => {
    if (direction === BridgeDirection.In) return { from: network, to: NERVOS_NETWORK };
    return { from: NERVOS_NETWORK, to: network };
  }, [direction, network]);

  const directionItems = networks.flatMap((network) => [
    { key: network + '-' + NERVOS_NETWORK, network, direction: BridgeDirection.In, from: network, to: NERVOS_NETWORK },
    { key: NERVOS_NETWORK + '-' + network, network, direction: BridgeDirection.Out, from: NERVOS_NETWORK, to: network },
  ]);

  const directionsElem = (
    <Menu>
      {directionItems.map((item) => (
        <Menu.Item key={item.key} onClick={() => onSelect({ direction: item.direction, network: item.network })}>
          <NetworkDirection from={item.from} to={item.to} />
        </Menu.Item>
      ))}
    </Menu>
  );

  const selectedItem = selected && <NetworkDirection from={selected.from} to={selected.to} />;

  return (
    <Dropdown trigger={['click']} overlay={directionsElem}>
      <LinearGradientButton block type="primary">
        {selectedItem}
      </LinearGradientButton>
    </Dropdown>
  );
};
