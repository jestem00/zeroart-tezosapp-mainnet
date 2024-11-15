// src/components/MintBurnTransfer/BalanceOf.js

import React, { useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  CircularProgress,
  Grid,
} from '@mui/material';

const BalanceOf = ({ contractAddress, Tezos, setSnackbar }) => {
  const [ownerAddress, setOwnerAddress] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleBalanceOf = async () => {
    if (!ownerAddress || !tokenId) {
      setSnackbar({
        open: true,
        message: 'Please enter owner address and token ID.',
        severity: 'warning',
      });
      return;
    }

    try {
      setLoading(true);
      const contract = await Tezos.contract.at(contractAddress);
      const storage = await contract.storage();

      // Assume ledger is a big_map from token_id to owner_address
      const owner = await storage.ledger.get(parseInt(tokenId));

      let balance = 0;
      if (owner && owner === ownerAddress) {
        balance = 1;
      } else {
        balance = 0;
      }
      setBalance(balance);
    } catch (error) {
      console.error('Error fetching balance:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch balance.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <Typography variant="h6">Check Balance</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            label="Owner Address *"
            value={ownerAddress}
            onChange={(e) => setOwnerAddress(e.target.value)}
            fullWidth
            placeholder="e.g., tz1..."
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Token ID *"
            value={tokenId}
            onChange={(e) => setTokenId(e.target.value)}
            fullWidth
            placeholder="e.g., 0"
          />
        </Grid>
      </Grid>
      <div style={{ marginTop: '20px' }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleBalanceOf}
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? 'Checking...' : 'Check Balance'}
        </Button>
      </div>
      {balance !== null && (
        <Typography variant="body1" style={{ marginTop: '20px' }}>
          Balance: {balance}
        </Typography>
      )}
    </div>
  );
};

export default BalanceOf;
