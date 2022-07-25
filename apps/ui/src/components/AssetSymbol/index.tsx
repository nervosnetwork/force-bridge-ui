import { QuestionOutlined } from '@ant-design/icons';
import React from 'react';
import styled from 'styled-components';

type AssetSymbolProps = {
  info?: {
    logoURI?: string;
    symbol?: string;
    uan?: string;
    displayName?: string;
  };
  inSelect?: boolean;
};

const AssetSymbolWrapper = styled.span`
  display: inline-block;
  align-items: center;

  .logo {
    margin: 0 4px;
    width: 1.4em;
    height: 1.4em;
    vertical-align: middle;
  }

  .symbolWrapper {
    display: inline-block;
    vertical-align: middle;
  }

  .symbol {
    font-weight: 700;
    display: block;
  }

  .displayName {
    font-weight: 300;
    display: block;
  }
`;

export const AssetSymbol: React.FC<React.HTMLAttributes<HTMLSpanElement> & AssetSymbolProps> = (props) => {
  const { logoURI, symbol = 'Unknown', displayName, ...wrapperProps } = props.info ?? {};
  const inSelect = props.inSelect;

  const logo = logoURI ? <img className="logo" alt={symbol} src={logoURI} /> : <QuestionOutlined className="logo" />;

  return (
    <AssetSymbolWrapper {...wrapperProps}>
      {logo}
      <span className="symbolWrapper">
        <span className="symbol">{symbol}</span>
        {inSelect && <span className="displayName">{displayName}</span>}
      </span>
    </AssetSymbolWrapper>
  );
};
