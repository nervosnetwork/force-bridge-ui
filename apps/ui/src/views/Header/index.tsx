import { MenuIcon } from '@heroicons/react/outline';
import { Box, Container, MenuItem, MenuList, Toolbar } from '@mui/material';
import React, { useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { ExpandedMenu } from './components/ExpandedMenu/ExpandedMenu';
import logo from './logo.png';
import { CustomizedAppBar } from './styled';
import { WalletConnectorButton } from 'components/WalletConnector';
import { menuItems } from 'interfaces/Header/MenuItems';
import { CanOpenExpandedMenu } from 'interfaces/Header/OpenExpandedMenu';
import { CustomizedIconButton } from 'shared-styled/styled';

export const AppHeader: React.FC = () => {
  const expandedMenuRef = useRef<CanOpenExpandedMenu>(null);
  const history = useHistory();
  const location = useLocation();

  const handleOpenExpandedMenu = () => {
    return expandedMenuRef.current?.openExpandedMenu();
  };

  const setParams = (isBridge: string) => {
    const params = new URLSearchParams(location.search);
    params.set('isBridge', isBridge);
    history.replace({ search: params.toString() });
  };

  const handleMenuItemClick = (item: string) => {
    switch (item) {
      case 'Transfer':
        setParams('true');
        break;
      case 'History':
        setParams('false');
        break;
      case 'More':
        expandedMenuRef.current?.openExpandedMenu();
        break;
    }
  };

  return (
    <>
      <CustomizedAppBar position="fixed" className="app-bar">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <img src={logo} alt="logo" />
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              <MenuList>
                {menuItems.map((item) => (
                  <MenuItem key={item.name} onClick={() => handleMenuItemClick(item.name)}>
                    {item.icon}
                    {item.name}
                  </MenuItem>
                ))}
              </MenuList>
            </Box>

            <Box sx={{ flexGrow: 1 }}>
              <WalletConnectorButton block type="primary" />
            </Box>

            <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
              <CustomizedIconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
                onClick={() => handleOpenExpandedMenu()}
              >
                <MenuIcon />
              </CustomizedIconButton>
            </Box>
          </Toolbar>
        </Container>
      </CustomizedAppBar>
      <ExpandedMenu ref={expandedMenuRef} handleMenuItemClick={handleMenuItemClick} />
    </>
  );
};
