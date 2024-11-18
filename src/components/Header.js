// src/components/Header.js

import React, { useContext, useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Menu,
  MenuItem,
  Snackbar,
  Alert,
} from '@mui/material';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { WalletContext } from '../contexts/WalletContext';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LanguageIcon from '@mui/icons-material/Language';
import { ReactComponent as Logo } from '../logo.svg'; // Ensure the path is correct
import { NETWORKS } from '../config/networkConfig'; // Import NETWORKS

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
  margin-right: 15px;
`;

const Header = () => {
  const {
    walletAddress,
    isWalletConnected,
    connectWallet,
    disconnectWallet,
    network,
    switchNetwork,
  } = useContext(WalletContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  const handleNetworkClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNetworkClose = () => {
    setAnchorEl(null);
  };

  const handleNetworkChange = async (selectedNetwork) => {
    if (selectedNetwork === network) {
      setSnackbar({ open: true, message: `Already connected to ${capitalize(selectedNetwork)}.`, severity: 'info' });
      handleNetworkClose();
      return;
    }

    try {
      // If wallet is connected, disconnect it before switching networks
      if (isWalletConnected) {
        await disconnectWallet();
        setSnackbar({ open: true, message: `Disconnected from ${capitalize(network)}. Switching to ${capitalize(selectedNetwork)}.`, severity: 'info' });
      }

      // Switch network in context
      await switchNetwork(selectedNetwork);
      setSnackbar({ open: true, message: `Switched to ${capitalize(selectedNetwork)}. Please reconnect your wallet.`, severity: 'success' });
    } catch (error) {
      console.error('Network Change Error:', error);
      setSnackbar({ open: true, message: `Network Change Error: ${error.message || 'Unknown error'}`, severity: 'error' });
    }

    handleNetworkClose();
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Link to="/">
            <Logo style={{ height: '40px', width: '40px', marginRight: '15px' }} />
          </Link>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Save The World With Art™ Beta
          </Typography>
          <StyledLink to="/">
            <Button color="inherit">Home</Button>
          </StyledLink>
          <StyledLink to="/generate">
            <Button color="inherit">Generate Contract</Button>
          </StyledLink>
          <StyledLink to="/mint-burn-transfer">
            <Button color="inherit">Mint/Burn/Transfer</Button>
          </StyledLink>
          <Button color="inherit" onClick={handleNetworkClick} startIcon={<LanguageIcon />}>
            {capitalize(network)}
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleNetworkClose}
          >
            {/* List available networks */}
            {Object.keys(NETWORKS).map((net) => (
              <MenuItem key={net} onClick={() => handleNetworkChange(net)}>
                {capitalize(net)}
              </MenuItem>
            ))}
          </Menu>
          {!isWalletConnected ? (
            <Button color="inherit" onClick={connectWallet} startIcon={<AccountBalanceWalletIcon />}>
              Connect Wallet
            </Button>
          ) : (
            <Button color="inherit" onClick={disconnectWallet} startIcon={<AccountBalanceWalletIcon />}>
              Disconnect ({walletAddress.substring(0, 6)}...{walletAddress.slice(-4)})
            </Button>
          )}
        </Toolbar>
      </AppBar>

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Header;
