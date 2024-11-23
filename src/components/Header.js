// src/components/Header.js

import React, { useContext, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Snackbar,
  Alert,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Divider,
  ListItemButton,
} from '@mui/material';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { WalletContext } from '../contexts/WalletContext';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { ReactComponent as Logo } from '../logo.svg'; // Ensure the path is correct

// Styled Components

// Styled Link for navigation
const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  margin-right: 15px;

  &:last-child {
    margin-right: 0;
  }
`;

// Logo container with responsive sizing
const LogoContainer = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
  margin-right: 15px;

  svg {
    /* Default logo size */
    height: 60px;
    width: 60px;

    /* Medium screens */
    @media (min-width: 600px) {
      height: 100px;
      width: 100px;
    }

    /* Large screens */
    @media (min-width: 960px) {
      height: 120px;
      width: 120px;
    }
  }
`;

// Navigation links container
const NavLinks = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: 960px) {
    display: none;
  }
`;

// Mobile menu button (hamburger icon)
const MobileMenuButton = styled(IconButton)`
  display: none;

  @media (max-width: 960px) {
    display: block;
  }
`;

// Drawer header for mobile menu
const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 0 8px;
  justify-content: flex-end;
`;

// Styled Button with smaller font size
const StyledButton = styled(Button)`
  && {
    font-size: 0.75rem; /* Reduced font size for desktop */

    @media (max-width: 960px) {
      font-size: 1rem; /* Slightly larger on mobile */
    }
  }
`;

// Header Component
const Header = () => {
  const {
    walletAddress,
    isWalletConnected,
    connectWallet,
    disconnectWallet,
  } = useContext(WalletContext);

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Toggle mobile drawer
  const toggleDrawer = (open) => (event) => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setDrawerOpen(open);
  };

  // Drawer list for mobile navigation
  const drawerList = (
    <div
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
      style={{ width: 250 }}
    >
      <DrawerHeader>
        <IconButton onClick={toggleDrawer(false)}>
          <CloseIcon />
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/">
            <ListItemText primary="Home" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/generate">
            <ListItemText primary="Generate Contract" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/mint-burn-transfer">
            <ListItemText primary="Mint/Burn/Transfer" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton component={Link} to="/on-chain-license">
            <ListItemText primary="On-Chain NFT License 2.0" />
          </ListItemButton>
        </ListItem>
      </List>
      <Divider />
      <List>
        {!isWalletConnected ? (
          <ListItem disablePadding>
            <ListItemButton onClick={connectWallet}>
              <AccountBalanceWalletIcon style={{ marginRight: '10px' }} />
              <ListItemText primary="Connect Wallet" />
            </ListItemButton>
          </ListItem>
        ) : (
          <ListItem disablePadding>
            <ListItemButton onClick={disconnectWallet}>
              <AccountBalanceWalletIcon style={{ marginRight: '10px' }} />
              <ListItemText
                primary={`Disconnect (${walletAddress.substring(0, 6)}...${walletAddress.slice(-4)})`}
              />
            </ListItemButton>
          </ListItem>
        )}
      </List>
    </div>
  );

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          {/* Logo */}
          <LogoContainer to="/">
            <Logo />
          </LogoContainer>

          {/* Title */}
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontSize: {
                xs: '1rem',    // Small screens
                sm: '1.25rem', // Medium screens
                md: '1.5rem',  // Large screens
              },
            }}
          >
            Save The World With Art™ Beta
          </Typography>

          {/* Navigation Links */}
          <NavLinks>
            <StyledLink to="/">
              <StyledButton color="inherit">Home</StyledButton>
            </StyledLink>
            <StyledLink to="/generate">
              <StyledButton color="inherit">Generate Contract</StyledButton>
            </StyledLink>
            <StyledLink to="/mint-burn-transfer">
              <StyledButton color="inherit">Mint/Burn/Transfer</StyledButton>
            </StyledLink>
            <StyledLink to="/on-chain-license">
              <StyledButton color="inherit">On-Chain NFT License 2.0</StyledButton>
            </StyledLink>
            {!isWalletConnected ? (
              <StyledButton
                color="inherit"
                onClick={connectWallet}
                startIcon={<AccountBalanceWalletIcon />}
              >
                Connect Wallet
              </StyledButton>
            ) : (
              <StyledButton
                color="inherit"
                onClick={disconnectWallet}
                startIcon={<AccountBalanceWalletIcon />}
              >
                Disconnect ({walletAddress.substring(0, 6)}...{walletAddress.slice(-4)})
              </StyledButton>
            )}
          </NavLinks>

          {/* Mobile Menu Button */}
          <MobileMenuButton
            edge="start"
            color="inherit"
            aria-label="menu"
            onClick={toggleDrawer(true)}
          >
            <MenuIcon />
          </MobileMenuButton>
        </Toolbar>
      </AppBar>

      {/* Drawer for Mobile Navigation */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        {drawerList}
      </Drawer>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Header;
