// src/config/networkConfig.js

import { NetworkType } from '@airgap/beacon-sdk';

export const NETWORKS = {
  mainnet: {
    name: 'mainnet',
    rpcUrl: process.env.REACT_APP_TEZOS_MAINNET_RPC, // e.g., "https://rpc.tzbeta.net/"
    type: NetworkType.MAINNET,
  },
  ghostnet: {
    name: 'ghostnet',
    rpcUrl: process.env.REACT_APP_TEZOS_GHOSTNET_RPC, // e.g., "https://ghostnet.smartpy.io"
    type: NetworkType.GHOSTNET,
  },
};
