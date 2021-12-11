import React, { forwardRef, useRef, useImperativeHandle, useEffect, useState } from 'react';
import { Grow, Paper, Grid, Typography, Link, IconButton, Box, useTheme, useMediaQuery } from '@mui/material';
import { XIcon } from '@heroicons/react/outline';
import { IMenuItems, expandedMenuItems } from '../../../../interfaces/Header/ExpandedMenuItems';
import '../../../../assets/styles/expanded-menu.scss';
import '../../../../assets/styles/icon-button.scss';
import logo from '../../logo.png';
import { CanOpenExpandedMenu } from 'interfaces/Header/OpenExpandedMenu';

export const ExpandedMenu = forwardRef<CanOpenExpandedMenu>((props, ref) => {
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const expandedMenuRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const smallScreen = useMediaQuery(theme.breakpoints.down('md'));

  useImperativeHandle(ref, () => ({
    openExpandedMenu,
  }));

  useEffect(() => {
    const closeExpandedMenu = (event: MouseEvent) => {
      if (expandedMenuRef.current && !expandedMenuRef.current.contains(event.target as HTMLDivElement)) {
        setIsChecked(false);
      }
    };

    document.addEventListener('mousedown', closeExpandedMenu);
    return () => {
      document.removeEventListener('mousedown', closeExpandedMenu);
    };
  }, [expandedMenuRef]);

  const openExpandedMenu = () => {
    setIsChecked((prev) => !prev);
  };

  const gridItem = (item: IMenuItems) => {
    return (
      <Grid
        key={item.name}
        item
        xs={3}
        component={Link}
        color="inherit"
        underline="none"
        sx={{ display: { xs: item.name && 'flex', md: 'block' } }}
      >
        <span className="item-icon">{item.icon}</span>
        <Typography> {item.name}</Typography>
        <Typography color="primary" variant="body2" sx={{ display: { xs: 'none', md: 'block' } }}>
          {' '}
          {item.description}
        </Typography>
      </Grid>
    );
  };

  return (
    <Grow in={isChecked}>
      <Paper className="expanded-menu" ref={expandedMenuRef}>
        <Grid container spacing={2} direction={{ xs: 'column', md: 'row' }}>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <img src={logo} />
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
              onClick={() => setIsChecked(false)}
            >
              <XIcon />
            </IconButton>
          </Box>
          {expandedMenuItems?.map((item) => {
            return ((!smallScreen && item.isDesktop) || smallScreen) && gridItem(item);
          })}
        </Grid>
      </Paper>
    </Grow>
  );
});
