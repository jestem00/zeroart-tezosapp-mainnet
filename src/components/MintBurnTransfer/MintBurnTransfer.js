// src/components/MintBurnTransfer/MintBurnTransfer.js

import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import {
  Typography,
  Paper,
  Button,
  Snackbar,
  Alert,
  TextField,
  CircularProgress,
} from '@mui/material';
import { WalletContext } from '../../contexts/WalletContext';
import Mint from './Mint';
import Burn from './Burn';
import Transfer from './Transfer';
import BalanceOf from './BalanceOf';
import UpdateOperators from './UpdateOperators';

const StyledPaper = styled(Paper)`
  padding: 20px;
  margin: 20px auto;
  max-width: 800px;
`;

const Disclaimer = styled.div`
  margin-top: 20px;
  padding: 10px;
  background-color: #fff8e1;
  border-left: 6px solid #ffeb3b;
`;

const MintBurnTransfer = () => {
  const { Tezos, isWalletConnected } = useContext(WalletContext);
  const [contractAddress, setContractAddress] = useState('');
  const [contractMetadata, setContractMetadata] = useState(null);
  const [loading, setLoading] = useState(false);
  const [action, setAction] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });


  const fetchContractMetadata = async () => {
    if (!contractAddress) {
      setSnackbar({ open: true, message: 'Please enter a contract address.', severity: 'warning' });
      return;
    }
    setLoading(true);
    try {
      const contract = await Tezos.contract.at(contractAddress);
      const storage = await contract.storage();

      // Access the metadata big map
      const metadataMap = storage.metadata;

      // Retrieve the metadata URI from the big map using the empty string key ''
      let metadataURI = await metadataMap.get('');

      if (!metadataURI) {
        throw new Error('Metadata URI not found in contract storage.');
      }

      // Decode metadataURI from hex string to UTF-8 string
      if (typeof metadataURI === 'string') {
        // Check if it's a hex string
        if (/^[0-9a-fA-F]+$/.test(metadataURI)) {
          metadataURI = Buffer.from(metadataURI, 'hex').toString('utf8');
        }
        // Else, it's already a UTF-8 string
      } else if (metadataURI.bytes) {
        metadataURI = Buffer.from(metadataURI.bytes, 'hex').toString('utf8');
      } else {
        throw new Error('Metadata URI has an unexpected type.');
      }

      // Log metadataURI for debugging
      console.log('Decoded metadataURI:', metadataURI);

      // Check if metadataURI starts with 'tezos-storage:'
      if (metadataURI.startsWith('tezos-storage:')) {
        const metadataKey = metadataURI.replace('tezos-storage:', '');

        // Retrieve the metadata content from the big map using the key from the URI
        let metadataContent = await metadataMap.get(metadataKey);

        if (!metadataContent) {
          throw new Error(`Metadata content not found in contract storage for key '${metadataKey}'.`);
        }

        // Decode metadataContent from hex string to UTF-8 string
        if (typeof metadataContent === 'string') {
          // Check if it's a hex string
          if (/^[0-9a-fA-F]+$/.test(metadataContent)) {
            metadataContent = Buffer.from(metadataContent, 'hex').toString('utf8');
          }
          // Else, it's already a UTF-8 string
        } else if (metadataContent.bytes) {
          metadataContent = Buffer.from(metadataContent.bytes, 'hex').toString('utf8');
        } else {
          throw new Error('Metadata content has an unexpected type.');
        }

        // Log metadataContent for debugging
        console.log('Decoded metadataContent:', metadataContent);

        // Parse the JSON metadata
        const metadata = JSON.parse(metadataContent);
        setContractMetadata(metadata);
      } else {
        throw new Error('Unsupported metadata URI scheme. Expected "tezos-storage:".');
      }

      setSnackbar({ open: true, message: 'Contract metadata loaded.', severity: 'success' });
    } catch (error) {
      console.error('Error fetching contract metadata:', error);
      setSnackbar({ open: true, message: error.message, severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleActionClick = (selectedAction) => {
    setAction(selectedAction);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <StyledPaper elevation={3}>
      <Typography variant="h5" gutterBottom>
        Mint, Burn, and Transfer NFTs
      </Typography>
      <Disclaimer>
        <Typography variant="body2">
          <strong>Disclaimer:</strong> This platform is provided "as is" without any warranties.
          Use at your own risk. Please test thoroughly on Ghostnet before deploying to mainnet.
          This platform only works with the fully on-chain #ZeroContract version 1.0.
        </Typography>
      </Disclaimer>
      {!isWalletConnected ? (
        <Typography variant="body1">Please connect your wallet to proceed.</Typography>
      ) : (
        <>
          <TextField
            label="Contract Address *"
            value={contractAddress}
            onChange={(e) => setContractAddress(e.target.value)}
            fullWidth
            placeholder="e.g., KT1..."
            style={{ marginBottom: '20px' }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={fetchContractMetadata}
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? 'Loading...' : 'Load Contract'}
          </Button>
          {contractMetadata && (
            <>
              <Typography variant="h6" style={{ marginTop: '20px' }}>
                {contractMetadata.name}
              </Typography>
              {contractMetadata.imageUri && (
                <img
                  src={contractMetadata.imageUri}
                  alt="Contract Thumbnail"
                  style={{ maxWidth: '100%', marginBottom: '20px' }}
                />
              )}
              <Typography variant="body1">{contractMetadata.description}</Typography>
              <div style={{ marginTop: '20px' }}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleActionClick('mint')}
                  style={{ marginRight: '10px' }}
                >
                  Mint
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() => handleActionClick('burn')}
                  style={{ marginRight: '10px' }}
                >
                  Burn
                </Button>
                <Button
                  variant="contained"
                  color="warning"
                  onClick={() => handleActionClick('transfer')}
                  style={{ marginRight: '10px' }}
                >
                  Transfer
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleActionClick('balance_of')}
                  style={{ marginRight: '10px' }}
                >
                  Balance Of
                </Button>
                <Button
                  variant="contained"
                  color="info"
                  onClick={() => handleActionClick('update_operators')}
                >
                  Update Operators
                </Button>
              </div>
              {action === 'mint' && (
                <Mint
                  contractAddress={contractAddress}
                  Tezos={Tezos}
                  setSnackbar={setSnackbar}
                />
              )}
              {action === 'burn' && (
                <Burn
                  contractAddress={contractAddress}
                  Tezos={Tezos}
                  setSnackbar={setSnackbar}
                />
              )}
              {action === 'transfer' && (
                <Transfer
                  contractAddress={contractAddress}
                  Tezos={Tezos}
                  setSnackbar={setSnackbar}
                />
              )}
              {action === 'balance_of' && (
                <BalanceOf
                  contractAddress={contractAddress}
                  Tezos={Tezos}
                  setSnackbar={setSnackbar}
                />
              )}
              {action === 'update_operators' && (
                <UpdateOperators
                  contractAddress={contractAddress}
                  Tezos={Tezos}
                  setSnackbar={setSnackbar}
                />
              )}
            </>
          )}
        </>
      )}
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
    </StyledPaper>
  );
};

export default MintBurnTransfer;
