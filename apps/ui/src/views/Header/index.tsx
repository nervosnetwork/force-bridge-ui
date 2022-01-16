import React, { useRef } from 'react';
import { WalletConnectorButton } from 'components/WalletConnector';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Container,
  Link,
  Button,
  ListItem,
  Grid,
  MenuList,
  MenuItem,
} from '@mui/material';
import { MenuIcon, SwitchHorizontalIcon } from '@heroicons/react/outline';
import logo from './logo.png';
import '../../assets/styles/app-bar.scss';
import '../../assets/styles/icon-button.scss';
import { ExpandedMenu } from './components/ExpandedMenu/ExpandedMenu';
import { CanOpenExpandedMenu } from 'interfaces/Header/OpenExpandedMenu';
import { menuItems } from 'interfaces/Header/MenuItems';
import { CustomizedAppBar } from './styled';
import { CustomizedIconButton } from 'shared-styled/styled';
import { Link as RouterLink, LinkProps, useHistory, useLocation } from 'react-router-dom';

const LinkBehavior = React.forwardRef<HTMLAnchorElement, LinkProps>((props, ref) => (
  <RouterLink ref={ref} {...props} />
));

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

  const handleMenuItemClick = (index: number) => {
    switch (index) {
      case 0:
        setParams('true');
        break;
      case 1:
        setParams('false');
        break;
      case 2:
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
                  <MenuItem onClick={() => handleMenuItemClick(index)}>
                    {item.icon}
                    {item.name}
                  </MenuItem>
                ))}
              </MenuList>

              {/* <MenuItem onClick={() => setParams('false')}>
                <Typography textAlign="center">History</Typography>
              </MenuItem> */}
              {/* <Button color="primary" component={LinkBehavior} underline="none" to="asdas">
                <SwitchHorizontalIcon />
                <Typography textAlign="center">Transfer</Typography>
              </Button> */}
              {/* <Link
                color="primary"
                onClick={() => handleOpenExpandedMenu(index)}
                component={LinkBehavior}
                underline="none"
                to={page.path}
              >
                {page.icon}
                <Typography textAlign="center">{page.name}</Typography>
              </Link>
              <Link
                color="primary"
                onClick={() => handleOpenExpandedMenu(index)}
                component={LinkBehavior}
                underline="none"
                to={page.path}
              >
                {page.icon}
                <Typography textAlign="center">{page.name}</Typography>
              </Link> */}
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
      <ExpandedMenu ref={expandedMenuRef} />
    </>
  );
};
