// src/components/MintBurnTransfer/Burn.js

import React, { useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  CircularProgress,
} from '@mui/material';

const Burn = ({ contractAddress, Tezos, setSnackbar }) => {
  const [tokenId, setTokenId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleBurn = async () => {
    if (!tokenId) {
      setSnackbar({ open: true, message: 'Please enter a token ID.', severity: 'warning' });
      return;
    }

    try {
      setLoading(true);
      const contract = await Tezos.wallet.at(contractAddress);
      const op = await contract.methods.burn(parseInt(tokenId)).send();
      await op.confirmation();

      setSnackbar({ open: true, message: 'NFT burned successfully.', severity: 'success' });
      setTokenId('');
    } catch (error) {
      console.error('Error burning NFT:', error);
      setSnackbar({ open: true, message: 'Burning failed.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <Typography variant="h6">Burn NFT</Typography>
      <TextField
        label="Token ID *"
        value={tokenId}
        onChange={(e) => setTokenId(e.target.value)}
        fullWidth
        placeholder="e.g., 0"
        style={{ marginTop: '10px' }}
      />
      <div style={{ marginTop: '20px', textAlign: 'right' }}>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleBurn}
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? 'Burning...' : 'Burn NFT'}
        </Button>
      </div>
    </div>
  );
};

export default Burn;
