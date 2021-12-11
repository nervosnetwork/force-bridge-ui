import React, { useRef } from 'react';
import { WalletConnectorButton } from 'components/WalletConnector';
import { AppBar, Box, Toolbar, IconButton, Typography, Container, Link } from '@mui/material';
import { MenuIcon } from '@heroicons/react/outline';
import logo from './logo.png';
import '../../assets/styles/app-bar.scss';
import '../../assets/styles/icon-button.scss';
import { ExpandedMenu } from './components/ExpandedMenu/ExpandedMenu';
import { CanOpenExpandedMenu } from 'interfaces/Header/OpenExpandedMenu';
import { menuItems } from 'interfaces/Header/MenuItems';

export const AppHeader: React.FC = () => {
  const expandedMenuRef = useRef<CanOpenExpandedMenu>(null);

  const handleOpenExpandedMenu = (index?: number) => {
    return (index === undefined || index === 2) && expandedMenuRef.current?.openExpandedMenu();
  };

  return (
    <>
      <AppBar position="fixed" className="app-bar">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <img src={logo} />
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {menuItems.map((page, index) => (
                <Link key={page.name} underline="none" color="primary" onClick={() => handleOpenExpandedMenu(index)}>
                  {page.icon}
                  <Typography textAlign="center">{page.name}</Typography>
                </Link>
              ))}
            </Box>

            <Box sx={{ flexGrow: 1 }}>
              <WalletConnectorButton block type="primary" />
            </Box>

            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
                onClick={() => handleOpenExpandedMenu()}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      <ExpandedMenu ref={expandedMenuRef} />
    </>
  );
};
