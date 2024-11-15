// src/components/MintBurnTransfer/Mint.js

import React, { useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  CircularProgress,
  Grid,
  FormControlLabel,
  Checkbox,
  Link,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
} from '@mui/material';
import { MichelsonMap } from '@taquito/taquito';
import MintUpload from './MintUpload';
import { Buffer } from 'buffer';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

const MAX_ATTRIBUTES = 10;
const MAX_ATTRIBUTE_NAME_LENGTH = 32;
const MAX_ATTRIBUTE_VALUE_LENGTH = 32;

const Mint = ({ contractAddress, Tezos, setSnackbar }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    creators: '',
    tags: '',
    toAddress: '',
    royalties: '',
    license: '',
    customLicense: '',
  });
  const [attributes, setAttributes] = useState([{ name: '', value: '' }]);
  const [artifactFile, setArtifactFile] = useState(null);
  const [artifactDataUrl, setArtifactDataUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const stringToHex = (str) => Buffer.from(str, 'utf8').toString('hex');

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // If the royalties field is being updated, ensure it doesn't exceed 10%
    if (name === 'royalties') {
      const royaltiesValue = parseFloat(value);
      if (royaltiesValue > 10) {
        setSnackbar({
          open: true,
          message: 'Royalties cannot exceed 10%.',
          severity: 'warning',
        });
        return;
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleAttributeChange = (index, field, value) => {
    // Enforce character limits
    if (
      (field === 'name' && value.length > MAX_ATTRIBUTE_NAME_LENGTH) ||
      (field === 'value' && value.length > MAX_ATTRIBUTE_VALUE_LENGTH)
    ) {
      setSnackbar({
        open: true,
        message: `Attribute ${field} cannot exceed ${
          field === 'name' ? MAX_ATTRIBUTE_NAME_LENGTH : MAX_ATTRIBUTE_VALUE_LENGTH
        } characters.`,
        severity: 'warning',
      });
      return;
    }

    const newAttributes = [...attributes];
    newAttributes[index][field] = value;

    // Check for duplicate attribute names
    if (field === 'name') {
      const attributeNames = newAttributes.map((attr) => attr.name.trim().toLowerCase());
      const nameOccurrences = attributeNames.reduce((acc, name) => {
        acc[name] = (acc[name] || 0) + 1;
        return acc;
      }, {});

      if (nameOccurrences[value.trim().toLowerCase()] > 1) {
        setSnackbar({
          open: true,
          message: `Attribute name "${value}" is already in use. Please use a unique name.`,
          severity: 'warning',
        });
        return;
      }
    }

    setAttributes(newAttributes);
  };

  const addAttribute = () => {
    if (attributes.length >= MAX_ATTRIBUTES) {
      setSnackbar({
        open: true,
        message: `You can add up to ${MAX_ATTRIBUTES} attributes only.`,
        severity: 'warning',
      });
      return;
    }
    setAttributes([...attributes, { name: '', value: '' }]);
  };

  const removeAttribute = (index) => {
    const newAttributes = attributes.filter((_, i) => i !== index);
    setAttributes(newAttributes);
  };

  const handleFileChange = (file) => {
    setArtifactFile(file);
  };

  const handleFileDataUrlChange = (dataUrl) => {
    setArtifactDataUrl(dataUrl);
  };

  const handleAgreementChange = (e) => {
    setAgreedToTerms(e.target.checked);
  };

  const handleMint = async () => {
    const {
      name,
      description,
      creators,
      tags,
      toAddress,
      royalties,
      license,
      customLicense,
    } = formData;

    if (!name || !description || !artifactFile || !creators || !toAddress) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields.',
        severity: 'warning',
      });
      return;
    }

    if (!agreedToTerms) {
      setSnackbar({
        open: true,
        message: 'You must agree to the terms before minting.',
        severity: 'warning',
      });
      return;
    }

    // Validate royalties (must be a number between 0 and 10)
    const royaltiesValue = parseFloat(royalties);
    if (isNaN(royaltiesValue) || royaltiesValue < 0 || royaltiesValue > 10) {
      setSnackbar({
        open: true,
        message: 'Royalties must be a number between 0 and 10.',
        severity: 'warning',
      });
      return;
    }

    // Validate attributes
    const attributeNamesSet = new Set();
    for (let attr of attributes) {
      if (attr.name.length > MAX_ATTRIBUTE_NAME_LENGTH) {
        setSnackbar({
          open: true,
          message: `Attribute name cannot exceed ${MAX_ATTRIBUTE_NAME_LENGTH} characters.`,
          severity: 'warning',
        });
        return;
      }
      if (attr.value.length > MAX_ATTRIBUTE_VALUE_LENGTH) {
        setSnackbar({
          open: true,
          message: `Attribute value cannot exceed ${MAX_ATTRIBUTE_VALUE_LENGTH} characters.`,
          severity: 'warning',
        });
        return;
      }
      const attrNameLower = attr.name.trim().toLowerCase();
      if (attributeNamesSet.has(attrNameLower)) {
        setSnackbar({
          open: true,
          message: `Duplicate attribute name "${attr.name}" detected. Please use unique names.`,
          severity: 'warning',
        });
        return;
      }
      attributeNamesSet.add(attrNameLower);
    }

    try {
      setLoading(true);

      // We already have artifactDataUrl from file upload
      const artifactUri = artifactDataUrl;

      // Get MIME type from file
      const mimeType = artifactFile.type;

      // Encode line breaks in description with 0D0A
      const encodedDescription = description.replace(/\r\n|\n/g, '\r\n');

      // Prepare royalties object
      const royaltiesObject = {
        decimals: 2,
        shares: {
          [toAddress]: Math.round(royaltiesValue * 100), // Convert percentage to integer (e.g., 10% -> 1000)
        },
      };

      // Create the metadata map
      const metadataMap = new MichelsonMap();

      // Required fields
      metadataMap.set('name', stringToHex(name));
      metadataMap.set('description', stringToHex(encodedDescription));
      metadataMap.set('artifactUri', stringToHex(artifactUri));
      metadataMap.set(
        'creators',
        stringToHex(JSON.stringify(creators.split(',').map((c) => c.trim())))
      );

      // Additional fields
      const rightsValue = license === 'Custom' ? customLicense : license;
      if (rightsValue) {
        metadataMap.set('rights', stringToHex(rightsValue));
      }
      metadataMap.set('decimals', stringToHex('0')); // NFTs typically have 0 decimals
      metadataMap.set('mimeType', stringToHex(mimeType));
      metadataMap.set('royalties', stringToHex(JSON.stringify(royaltiesObject)));

      // Handle attributes
      const filteredAttributes = attributes.filter((attr) => attr.name && attr.value);
      if (filteredAttributes.length > 0) {
        metadataMap.set('attributes', stringToHex(JSON.stringify(filteredAttributes)));
      }

      if (tags) {
        metadataMap.set(
          'tags',
          stringToHex(JSON.stringify(tags.split(',').map((t) => t.trim())))
        );
      }

      const contract = await Tezos.wallet.at(contractAddress);
      const op = await contract.methods.mint(metadataMap, toAddress).send();
      await op.confirmation();

      setSnackbar({
        open: true,
        message: 'NFT minted successfully.',
        severity: 'success',
      });
      // Reset form
      setFormData({
        name: '',
        description: '',
        creators: '',
        tags: '',
        toAddress: '',
        royalties: '',
        license: '',
        customLicense: '',
      });
      setAttributes([{ name: '', value: '' }]);
      setArtifactFile(null);
      setArtifactDataUrl(null);
      setAgreedToTerms(false);
    } catch (error) {
      console.error('Error minting NFT:', error);
      setSnackbar({
        open: true,
        message: `Minting failed: ${error.message}`,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginTop: '20px' }}>
      <Typography variant="h6">Mint NFT Fully On-Chain</Typography>
      <Typography variant="body2" gutterBottom>
        Enter the metadata for your NFT. Fields marked with an asterisk (*) are required.
      </Typography>
      <Grid container spacing={2}>
        {/* Name */}
        <Grid item xs={12}>
          <TextField
            label="Name *"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            fullWidth
            placeholder="NFT Name"
          />
        </Grid>
        {/* Description */}
        <Grid item xs={12}>
          <TextField
            label="Description *"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            fullWidth
            multiline
            rows={4}
            placeholder="NFT Description"
          />
        </Grid>
        {/* Artifact Upload */}
        <Grid item xs={12}>
          <Typography variant="body1">Artifact File *</Typography>
          <MintUpload
            onFileChange={handleFileChange}
            onFileDataUrlChange={handleFileDataUrlChange}
          />
        </Grid>
        {/* Preview Image */}
        {artifactDataUrl && (
          <Grid item xs={12}>
            <Typography variant="body1">Preview:</Typography>
            <img
              src={artifactDataUrl}
              alt="NFT Preview"
              style={{
                maxWidth: '100%',
                maxHeight: '300px',
                marginTop: '10px',
              }}
            />
          </Grid>
        )}
        {/* Creators */}
        <Grid item xs={12}>
          <TextField
            label="Creator Address *"
            name="creators"
            value={formData.creators}
            onChange={handleInputChange}
            fullWidth
            placeholder="Your Tezos address (e.g., tz1...)"
          />
        </Grid>
        {/* Royalties */}
        <Grid item xs={12}>
          <TextField
            label="Royalties (%) * (Maximum 10%)"
            name="royalties"
            value={formData.royalties}
            onChange={handleInputChange}
            fullWidth
            placeholder="e.g., 10"
            type="number"
            InputProps={{ inputProps: { min: 0, max: 10, step: 0.01 } }}
          />
        </Grid>
        {/* License */}
        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel id="license-label">License</InputLabel>
            <Select
              labelId="license-label"
              name="license"
              value={formData.license}
              onChange={handleInputChange}
              label="License"
            >
              <MenuItem value="">Select a License</MenuItem>
              <MenuItem value="CC0 (Public Domain)">CC0 (Public Domain)</MenuItem>
              <MenuItem value="All Rights Reserved">All Rights Reserved</MenuItem>
              <MenuItem value="CC BY 4.0">CC BY 4.0</MenuItem>
              <MenuItem value="CC BY-SA 4.0">CC BY-SA 4.0</MenuItem>
              <MenuItem value="CC BY-ND 4.0">CC BY-ND 4.0</MenuItem>
              <MenuItem value="CC BY-NC 4.0">CC BY-NC 4.0</MenuItem>
              <MenuItem value="CC BY-NC-SA 4.0">CC BY-NC-SA 4.0</MenuItem>
              <MenuItem value="CC BY-NC-ND 4.0">CC BY-NC-ND 4.0</MenuItem>
              <MenuItem value="MIT">MIT</MenuItem>
              <MenuItem value="GPL">GPL</MenuItem>
              <MenuItem value="Apache 2.0">Apache 2.0</MenuItem>
              <MenuItem value="Unlicense">Unlicense</MenuItem>
              <MenuItem value="Custom">Custom</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {/* Custom License */}
        {formData.license === 'Custom' && (
          <Grid item xs={12}>
            <TextField
              label="Custom License *"
              name="customLicense"
              value={formData.customLicense}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={2}
              placeholder="Enter your custom license text"
            />
          </Grid>
        )}
        {/* Attributes */}
        <Grid item xs={12}>
          <Typography variant="body1">Attributes</Typography>
          {attributes.map((attribute, index) => (
            <Grid container spacing={1} key={index} alignItems="center">
              <Grid item xs={5}>
                <TextField
                  label="Name"
                  value={attribute.name}
                  onChange={(e) => handleAttributeChange(index, 'name', e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={5}>
                <TextField
                  label="Value"
                  value={attribute.value}
                  onChange={(e) => handleAttributeChange(index, 'value', e.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={2}>
                {index === 0 ? (
                  <IconButton onClick={addAttribute} color="primary">
                    <AddCircleIcon />
                  </IconButton>
                ) : (
                  <IconButton onClick={() => removeAttribute(index)} color="secondary">
                    <RemoveCircleIcon />
                  </IconButton>
                )}
              </Grid>
            </Grid>
          ))}
        </Grid>
        {/* Tags */}
        <Grid item xs={12}>
          <TextField
            label="Tags"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            fullWidth
            placeholder="Comma-separated tags"
          />
        </Grid>
        {/* Recipient Address */}
        <Grid item xs={12}>
          <TextField
            label="Recipient Address *"
            name="toAddress"
            value={formData.toAddress}
            onChange={handleInputChange}
            fullWidth
            placeholder="Address to receive the NFT (e.g., tz1...)"
          />
        </Grid>
        {/* Agree to Terms */}
        <Grid item xs={12}>
          <FormControlLabel
            control={
              <Checkbox
                checked={agreedToTerms}
                onChange={handleAgreementChange}
                color="primary"
              />
            }
            label={
              <span>
                I agree to the{' '}
                <Link href="/terms" target="_blank" rel="noopener">
                  terms and conditions
                </Link>
                .
              </span>
            }
          />
        </Grid>
      </Grid>
      <div style={{ marginTop: '20px', textAlign: 'right' }}>
        <Button
          variant="contained"
          color="success"
          onClick={handleMint}
          disabled={loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? 'Minting...' : 'Mint NFT'}
        </Button>
      </div>
    </div>
  );
};

export default Mint;
