// src/contexts/WalletContext.js

import React, { createContext, useState, useEffect } from 'react';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { TezosToolkit, MichelCodecPacker } from '@taquito/taquito';

export const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [wallet, setWallet] = useState(null);
  const [Tezos, setTezos] = useState(new TezosToolkit('https://ghostnet.smartpy.io'));
  const [walletAddress, setWalletAddress] = useState('');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [network, setNetwork] = useState('ghostnet'); // Default to Ghostnet

  useEffect(() => {
    const setupWallet = async () => {
      const tezosToolkit = new TezosToolkit(
        network === 'mainnet' ? 'https://mainnet.smartpy.io' : 'https://ghostnet.smartpy.io'
      );
      tezosToolkit.setPackerProvider(new MichelCodecPacker());
      const beaconWallet = new BeaconWallet({
        name: 'SaveTheWorldWithArt™',
        preferredNetwork: network,
      });
      tezosToolkit.setWalletProvider(beaconWallet);
      setWallet(beaconWallet);
      setTezos(tezosToolkit);

      const activeAccount = await beaconWallet.client.getActiveAccount();
      if (activeAccount) {
        const address = await beaconWallet.getPKH();
        setWalletAddress(address);
        setIsWalletConnected(true);
      } else {
        setWalletAddress('');
        setIsWalletConnected(false);
      }
    };

    setupWallet();
  }, [network]); // Re-run when network changes

  const connectWallet = async () => {
    try {
      await wallet.requestPermissions({ network: { type: network } });
      const address = await wallet.getPKH();
      setWalletAddress(address);
      setIsWalletConnected(true);
    } catch (error) {
      console.error('Wallet connection error:', error);
      // Notifications should be handled within UI components
    }
  };

  const disconnectWallet = async () => {
    await wallet.clearActiveAccount();
    setWalletAddress('');
    setIsWalletConnected(false);
  };

  return (
    <WalletContext.Provider
      value={{
        wallet,
        Tezos,
        walletAddress,
        isWalletConnected,
        connectWallet,
        disconnectWallet,
        network,
        setNetwork, // Expose setNetwork to change the network
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
