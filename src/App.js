// src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './components/Home';
import GenerateContract from './components/GenerateContract';
import ImpactMetrics from './components/ImpactMetrics';
import MintBurnTransfer from './components/MintBurnTransfer/MintBurnTransfer';
import Terms from './components/Terms';
import styled from 'styled-components';
import { WalletProvider } from './contexts/WalletContext';

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

function App() {
  return (
    <WalletProvider>
      <Router>
        <Header />
        <MainContainer>
          <ImpactMetrics />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/generate" element={<GenerateContract />} />
            <Route path="/mint-burn-transfer" element={<MintBurnTransfer />} />
            <Route path="/terms" element={<Terms />} />
          </Routes>
        </MainContainer>
      </Router>
    </WalletProvider>
  );
}

export default App;
