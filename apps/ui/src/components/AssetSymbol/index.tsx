import { QuestionOutlined } from '@ant-design/icons';
import { Avatar, Box, Typography } from '@mui/material';
import React from 'react';
import styled from 'styled-components';

type AssetSymbolProps = {
  info?: {
    logoURI?: string;
    symbol?: string;
  };
};

export const AssetSymbol: React.FC<React.HTMLAttributes<HTMLSpanElement> & AssetSymbolProps> = (props) => {
  const { logoURI, symbol = 'Unknown', ...wrapperProps } = props.info ?? {};

  return (
    <Box display="flex" alignItems="center" {...wrapperProps}>
      <Avatar sx={{ width: 32, height: 32 }} alt="Remy Sharp" src={logoURI} />
      <Typography color="text.primary" variant="body2" fontWeight={700} marginLeft={1.5}>
        {symbol}
      </Typography>
    </Box>
  );
};
