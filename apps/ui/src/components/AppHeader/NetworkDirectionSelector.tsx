import { Button, Dropdown, Menu } from 'antd';
import React from 'react';
import { NetworkDirection } from 'components/Network';

interface NetworkDirectionSelectorProps {
  directions: { from: string; to: string }[];
  selectedIndex?: number;
}

export const NetworkDirectionSelector: React.FC<NetworkDirectionSelectorProps> = (props) => {
  const { directions, selectedIndex } = props;

  const directionsElem = (
    <Menu>
      {directions.map((direction, i) => (
        <Menu.Item key={i}>
          <NetworkDirection from={direction.from} to={direction.to} />
        </Menu.Item>
      ))}
    </Menu>
  );

  const selected = directions[selectedIndex ?? 0];
  const selectedItem = selected && <NetworkDirection from={selected.from} to={selected.to} />;

  return (
    <Dropdown trigger={['click']} overlay={directionsElem}>
      <Button type="primary">{selectedItem}</Button>
    </Dropdown>
  );
};
