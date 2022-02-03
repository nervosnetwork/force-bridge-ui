import { Grid, Typography } from '@mui/material';
import React from 'react';
import { NervosLogo } from './styled';
import logo from 'assets/images/nervos-logo-white.svg';

export const Footer: React.FC = () => {
  return (
    <Grid container justifyContent="space-between" padding={3}>
      <Grid item>
        <Typography color="text.secondary">© Force Bridge</Typography>
      </Grid>
      <Grid item>
        <NervosLogo src={logo} />
      </Grid>
      <Grid item>
        <Typography color="text.secondary" display="inline-block">
          About
        </Typography>
        <Typography color="text.secondary" display="inline-block" marginLeft={2}>
          Terms
        </Typography>
      </Grid>
    </Grid>
  );
};
