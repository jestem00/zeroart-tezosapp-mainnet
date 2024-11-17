// src/components/Header.js

import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Menu, MenuItem } from '@mui/material';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { WalletContext } from '../contexts/WalletContext';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import LanguageIcon from '@mui/icons-material/Language';
import { ReactComponent as Logo } from '../logo.svg'; // Adjusted path

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
    setNetwork,
  } = useContext(WalletContext);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleNetworkClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNetworkClose = () => {
    setAnchorEl(null);
  };

  const handleNetworkChange = (selectedNetwork) => {
    setNetwork(selectedNetwork);
    handleNetworkClose();
  };

  return (
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
          {network === 'mainnet' ? 'Mainnet' : 'Ghostnet'}
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleNetworkClose}
        >
          <MenuItem onClick={() => handleNetworkChange('mainnet')}>Mainnet</MenuItem>
          <MenuItem onClick={() => handleNetworkChange('ghostnet')}>Ghostnet</MenuItem>
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
  );
};

export default Header;
