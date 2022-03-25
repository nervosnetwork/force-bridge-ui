import { MenuIcon } from '@heroicons/react/outline';
import { Box, Container, MenuItem, MenuList, Toolbar } from '@mui/material';
import React, { useRef } from 'react';

import { ExpandedMenu } from './components/ExpandedMenu/index';
import { SwitchAlert } from './components/SwitchAlert';
import { CustomizedAppBar } from './styled';
import logo from 'assets/images/force-logo.png';
import { WalletConnectorButton } from 'components/WalletConnector';
import { useBridgePath } from 'hooks/useBridgePath';
import { menuItems } from 'interfaces/Header/MenuItems';
import { CanOpenExpandedMenu } from 'interfaces/Header/OpenExpandedMenu';
import { CustomizedIconButton } from 'shared-styled/styled';

export const AppHeader: React.FC = () => {
  const expandedMenuRef = useRef<CanOpenExpandedMenu>(null);
  const { setPath } = useBridgePath();

  const handleOpenExpandedMenu = () => {
    return expandedMenuRef.current?.openExpandedMenu();
  };

  const handleMenuItemClick = (item: string) => {
    switch (item) {
      case 'Transfer':
        setPath('transfer');
        break;
      case 'History':
        setPath('history');
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
          <SwitchAlert />
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
              <WalletConnectorButton />
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
