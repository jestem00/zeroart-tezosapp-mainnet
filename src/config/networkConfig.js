// src/config/networkConfig.js

import { NetworkType } from '@airgap/beacon-sdk';

export const NETWORKS = {
  mainnet: {
    name: 'mainnet',
    rpcUrl: process.env.REACT_APP_TEZOS_MAINNET_RPC || 'https://mainnet.ecadinfra.com',
    type: NetworkType.MAINNET,
  },
};
