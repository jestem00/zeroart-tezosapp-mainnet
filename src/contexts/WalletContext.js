// src/contexts/WalletContext.js

import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { TezosToolkit } from '@taquito/taquito';
import { NETWORKS } from '../config/networkConfig';

// Create the Wallet Context
export const WalletContext = createContext();

// Wallet Provider Component
export const WalletProvider = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState('');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [network, setNetwork] = useState('mainnet'); // Default to mainnet
  const [tezos, setTezos] = useState(null);
  
  // Using ref to store BeaconWallet instance to prevent multiple instances
  const beaconWalletRef = useRef(null);

  // Initialize BeaconWallet and TezosToolkit whenever network changes
  useEffect(() => {
    const initializeWallet = async () => {
      try {
        console.log(`Initializing wallet for network: ${network}`);
        const networkConfig = NETWORKS[network];

        // Initialize BeaconWallet only if not already initialized for the current network
        if (!beaconWalletRef.current || beaconWalletRef.current.preferredNetwork !== networkConfig.type) {
          // If a different BeaconWallet instance exists, clear it
          if (beaconWalletRef.current) {
            await beaconWalletRef.current.clearActiveAccount();
            console.log('Cleared previous BeaconWallet active account.');
          }

          const beaconWallet = new BeaconWallet({
            name: 'SaveTheWorldWithArt.io',
            preferredNetwork: networkConfig.type,
            disableDefaultEvents: false, // Enable wallet selection
            enableLogging: true, // Enables logging for debugging
          });

          beaconWalletRef.current = beaconWallet;

          // Initialize Tezos Toolkit with the selected network's RPC
          const tezosToolkit = new TezosToolkit(networkConfig.rpcUrl);
          tezosToolkit.setWalletProvider(beaconWallet);

          setTezos(tezosToolkit);

          console.log('BeaconWallet and TezosToolkit initialized successfully.');

          // Check for active account
          const activeAccount = await beaconWallet.client.getActiveAccount();
          if (activeAccount) {
            console.log('Active account found during initialization:', activeAccount);
            setWalletAddress(activeAccount.address);
            setIsWalletConnected(true);
          } else {
            console.log('No active account found during initialization.');
          }
        } else {
          console.log('BeaconWallet already initialized for the current network.');
        }
      } catch (error) {
        console.error('Error initializing wallet:', error);
      }
    };

    initializeWallet();
  }, [network]);

  // Connect Wallet Function
  const connectWallet = useCallback(async () => {
    const beaconWallet = beaconWalletRef.current;
    if (!beaconWallet) {
      console.warn('BeaconWallet is not initialized.');
      return;
    }

    try {
      console.log('Attempting to connect wallet...');
      const activeAccount = await beaconWallet.client.getActiveAccount();
      console.log('Active account fetched:', activeAccount);

      if (!activeAccount) {
        console.log('No active account found. Requesting permissions...');
        await beaconWallet.requestPermissions();
        console.log('Permissions requested.');
      }

      const userAddress = await beaconWallet.getPKH();
      setWalletAddress(userAddress);
      setIsWalletConnected(true);
      console.log(`Wallet connected: ${userAddress}`);
    } catch (error) {
      console.error('Wallet Connection Error:', error);
      // Optionally, you can set error state here to inform the user
    }
  }, []);

  // Disconnect Wallet Function
  const disconnectWallet = useCallback(async () => {
    const beaconWallet = beaconWalletRef.current;
    if (!beaconWallet) {
      console.warn('BeaconWallet is not initialized.');
      return;
    }

    try {
      console.log('Disconnecting wallet...');
      await beaconWallet.clearActiveAccount();
      setWalletAddress('');
      setIsWalletConnected(false);
      console.log('Wallet disconnected successfully.');
    } catch (error) {
      console.error('Wallet Disconnection Error:', error);
      // Optionally, you can set error state here to inform the user
    }
  }, []);

  // Polling for Account Changes (Optional but useful for multi-account scenarios)
  useEffect(() => {
    let interval = null;

    const checkActiveAccount = async () => {
      const beaconWallet = beaconWalletRef.current;
      if (!beaconWallet || !isWalletConnected) return;

      try {
        const userAddress = await beaconWallet.getPKH();
        if (userAddress && userAddress !== walletAddress) {
          console.log(`Active account updated: ${userAddress}`);
          setWalletAddress(userAddress);
        }
      } catch (error) {
        console.error('Error checking active account:', error);
      }
    };

    if (isWalletConnected) {
      // Initial check
      checkActiveAccount();

      // Polling: Check every 5 seconds
      interval = setInterval(() => {
        checkActiveAccount();
      }, 5000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isWalletConnected, walletAddress]);

  // Effect to handle network switching and re-initialize wallet
  useEffect(() => {
    if (isWalletConnected) {
      // Disconnect the wallet before re-initializing with new network
      disconnectWallet();
    }
    // The wallet will be re-initialized due to the network change
  }, [network, isWalletConnected, disconnectWallet]);

  // Function to switch networks
  const switchNetwork = async (newNetwork) => {
    if (!NETWORKS[newNetwork]) {
      console.error(`Network "${newNetwork}" is not defined in networkConfig.js`);
      return;
    }

    if (newNetwork === network) {
      console.warn(`Already connected to ${newNetwork}.`);
      return;
    }

    console.log(`Switching network from ${network} to ${newNetwork}...`);
    setNetwork(newNetwork);
  };

  return (
    <WalletContext.Provider
      value={{
        walletAddress,
        isWalletConnected,
        connectWallet,
        disconnectWallet,
        network,
        switchNetwork, // Expose the switchNetwork function
        tezos,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};
