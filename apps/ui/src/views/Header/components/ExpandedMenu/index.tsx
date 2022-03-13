import { XIcon } from '@heroicons/react/outline';
import { Box, Grid, Grow, Link, Typography, useMediaQuery, useTheme } from '@mui/material';
import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { CustomizedExpandedMenu } from './styled';
import logo from 'assets/images/force-logo.png';
import { expandedMenuItems, IMenuItems } from 'interfaces/Header/ExpandedMenuItems';
import { CanOpenExpandedMenu } from 'interfaces/Header/OpenExpandedMenu';
import { CustomizedIconButton } from 'shared-styled/styled';

interface ExpandedMenuProps {
  handleMenuItemClick(item: string): void;
}

export const ExpandedMenu = forwardRef<CanOpenExpandedMenu, ExpandedMenuProps>((props, ref) => {
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

  const handleMobileMenuClick = (name: string) => {
    props.handleMenuItemClick(name);
    setIsChecked(false);
  };

  const gridItem = (item: IMenuItems) => {
    return (
      <Grid
        key={item.name}
        item
        xs={3}
        component={Link}
        href={item.href}
        target={item.target}
        color="inherit"
        underline="none"
        sx={{ display: { xs: item.name && 'flex', md: 'block' } }}
        onClick={() => handleMobileMenuClick(item.name)}
      >
        <span className="item-icon">{item.icon}</span>
        <Typography> {item.name}</Typography>
        <Typography color="primary" variant="body2" sx={{ display: { xs: 'none', md: 'block' } }}>
          {item.description}
        </Typography>
      </Grid>
    );
  };

  return (
    <Grow in={isChecked}>
      <CustomizedExpandedMenu ref={expandedMenuRef}>
        <Grid container spacing={2} direction={{ xs: 'column', md: 'row' }}>
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <img src={logo} alt="logo" />
            <CustomizedIconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              color="inherit"
              onClick={() => setIsChecked(false)}
            >
              <XIcon />
            </CustomizedIconButton>
          </Box>
          {expandedMenuItems?.map((item) => {
            return ((!smallScreen && item.isDesktop) || smallScreen) && gridItem(item);
          })}
        </Grid>
      </CustomizedExpandedMenu>
    </Grow>
  );
});
