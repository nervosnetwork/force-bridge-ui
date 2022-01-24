import React, { useRef } from 'react';
import { WalletConnectorButton } from 'components/WalletConnector';
import { Box, Toolbar, Container, MenuList, MenuItem } from '@mui/material';
import { MenuIcon } from '@heroicons/react/outline';
import logo from './logo.png';
import { ExpandedMenu } from './components/ExpandedMenu/ExpandedMenu';
import { CanOpenExpandedMenu } from 'interfaces/Header/OpenExpandedMenu';
import { menuItems } from 'interfaces/Header/MenuItems';
import { CustomizedAppBar } from './styled';
import { CustomizedIconButton } from 'shared-styled/styled';
import { useHistory, useLocation } from 'react-router-dom';

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
    console.log(item);
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
            <img src={logo} />
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              <MenuList>
                {menuItems.map((item, index) => (
                  <MenuItem onClick={() => handleMenuItemClick(item.name)}>
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
