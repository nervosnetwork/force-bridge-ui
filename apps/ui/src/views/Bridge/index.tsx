import React from 'react';
import { BridgeHistory } from 'views/Bridge/BridgeHistory';
import { BridgeOperation } from 'views/Bridge/BridgeOperation';

export const BridgeView: React.FC = () => {
  return (
    <div>
      <BridgeOperation />
      <div style={{ padding: '8px' }} />
      <BridgeHistory />
    </div>
  );
};
