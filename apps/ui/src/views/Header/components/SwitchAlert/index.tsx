import { Close as CloseIcon } from '@mui/icons-material';
import { Collapse, Link, IconButton, Typography, Box } from '@mui/material';
import React from 'react';
import { CustomizedAlert } from './styled';

export const SwitchAlert: React.FC = () => {
  const [open, setOpen] = React.useState(true);

  return (
    <Collapse in={open}>
      <CustomizedAlert
        variant="outlined"
        severity="info"
        action={
          <IconButton
            aria-label="close"
            color="inherit"
            size="small"
            onClick={() => {
              setOpen(false);
            }}
          >
            <CloseIcon fontSize="inherit" />
          </IconButton>
        }
      >
        <Box display="flex">
          <Typography variant="body2" color="primary.light">
            The CKB wallet have been switched from pw-lock to omni-lock. If you have assets locked in previous wallet,
            please visit
          </Typography>

          <Link
            href="https://github.com/nervosnetwork/force-bridge/blob/main/docs/asset-migration-guide.md"
            target="_blank"
            rel="noreferrer"
            variant="body2"
            sx={{ marginLeft: 1 }}
          >
            Asset Migration Guide
          </Link>
        </Box>
      </CustomizedAlert>
    </Collapse>
  );
};
