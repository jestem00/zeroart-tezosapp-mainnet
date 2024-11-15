// src/components/MintBurnTransfer/UpdateOperators.js

// Optional: Implement this component if needed.

import React, { useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  CircularProgress,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';

const UpdateOperators = ({ contractAddress, Tezos, setSnackbar }) => {
  const [operatorType, setOperatorType] = useState('add_operator');
  const [ownerAddress, setOwnerAddress] = useState('');
  const [operatorAddress, setOperatorAddress] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpdateOperators = async () => {
    if (!ownerAddress || !operatorAddress || !tokenId) {
      setSnackbar({ open: true, message: 'Please fill in all required fields.', severity: 'warning' });
      return;
    }

    try {
      setLoading(true);
      const contract = await Tezos.wallet.at(contractAddress);
      const updateParams = [
        {
          [operatorType]: {
            owner: ownerAddress,
            operator: operatorAddress,
            token_id: parseInt(tokenId),
          },
        },
      ];
      const op = await contract.methods.update_operators(updateParams).send();
      await op.confirmation();

      setSnackbar({ open: true, message: 'Operator updated successfully.', severity: 'success' });
      setOwnerAddress('');
      setOperatorAddress('');
      setTokenId('');
    } catch (error) {
      console.error('Error updating operator:', error);
      setSnackbar({ open: true, message: 'Update failed.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <Typography variant="h6">Update Operators</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Action *</InputLabel>
            <Select
              value={operatorType}
              onChange={(e) => setOperatorType(e.target.value)}
            >
              <MenuItem value="add_operator">Add Operator</MenuItem>
              <MenuItem value="remove_operator">Remove Operator</MenuItem>
            </Select>
          </FormControl>
        </Grid>
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
            label="Operator Address *"
            value={operatorAddress}
            onChange={(e) => setOperatorAddress(e.target.value)}
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
          color="info"
          onClick={handleUpdateOperators}
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? 'Updating...' : 'Update Operator'}
        </Button>
      </div>
    </div>
  );
};

export default UpdateOperators;
