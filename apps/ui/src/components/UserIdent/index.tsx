import { Tooltip, Typography } from '@mui/material';
import React from 'react';
import { truncateMiddle } from 'utils';

interface UserIdentProps {
  ident: string;
  truncateLength?: number;
}

export const UserIdent: React.FC<UserIdentProps> = ({ ident, truncateLength = 10 }) => {
  return (
    <Tooltip title={ident}>
      <Typography>{truncateMiddle(ident, truncateLength)}</Typography>
    </Tooltip>
  );
};
