import { MenuIcon } from '@heroicons/react/outline';
import { Box, Container, MenuItem, MenuList, Toolbar } from '@mui/material';
import React, { useEffect, useRef, useState } from 'react';

import { useLocation } from 'react-router-dom';
import { ExpandedMenu } from './components/ExpandedMenu/index';
import { SwitchAlert } from './components/SwitchAlert';
import { CustomizedAppBar } from './styled';
import logo from 'assets/images/force-logo.png';
import { WalletConnectorButton } from 'components/WalletConnector';
import { useBridgePath } from 'hooks/useBridgePath';
import { ETransfer, menuItems } from 'interfaces/Header/MenuItems';
import { CanOpenExpandedMenu } from 'interfaces/Header/OpenExpandedMenu';
import { CustomizedIconButton } from 'shared-styled/styled';

export const AppHeader: React.FC = () => {
  const expandedMenuRef = useRef<CanOpenExpandedMenu>(null);
  const { setPath } = useBridgePath();
  const [activeTab, setActiveTab] = useState<ETransfer>();
  const location = useLocation();

  const handleOpenExpandedMenu = () => {
    return expandedMenuRef.current?.openExpandedMenu();
  };

  const handleMenuItemClick = (item: ETransfer) => {
    switch (item) {
      case ETransfer.TRANSFER:
        setPath('transfer');
        break;
      case ETransfer.HISTORY:
        setPath('history');
        break;
      case ETransfer.MORE:
        expandedMenuRef.current?.openExpandedMenu();
        break;
    }
  };

  useEffect(() => {
    if (location.pathname.includes('bridge')) {
      setActiveTab(ETransfer.TRANSFER);
    } else {
      setActiveTab(ETransfer.HISTORY);
    }
  }, [location]);

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
                  <MenuItem
                    selected={item.value === activeTab}
                    key={item.value}
                    onClick={() => handleMenuItemClick(item.value)}
                  >
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
