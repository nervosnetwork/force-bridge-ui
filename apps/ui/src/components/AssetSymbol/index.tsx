import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { Avatar, Box, Typography } from '@mui/material';
import React from 'react';

type AssetSymbolProps = {
  info?: {
    logoURI?: string;
    symbol?: string;
  };
};

export const AssetSymbol: React.FC<React.HTMLAttributes<HTMLSpanElement> & AssetSymbolProps> = (props) => {
  const { logoURI, symbol = 'Unknown', ...wrapperProps } = props.info ?? {};

  const logo = logoURI ? <Avatar sx={{ width: 32, height: 32 }} alt="Remy Sharp" src={logoURI} /> : <HelpOutlineIcon />;

  return (
    <Box display="flex" alignItems="center" {...wrapperProps}>
      {logo}
      <Typography color="text.primary" variant="body2" fontWeight={700} marginLeft={1.5}>
        {symbol}
      </Typography>
    </Box>
  );
};
