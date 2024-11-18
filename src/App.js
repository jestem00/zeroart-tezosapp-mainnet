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

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

function App() {
  return (
    <Router>
      <Header />
      <MainContainer>
        <ImpactMetrics />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/generate" element={<GenerateContract />} />
          <Route path="/mint-burn-transfer" element={<MintBurnTransfer />} />
          <Route path="/terms" element={<Terms />} />
          {/* Add other routes as needed */}
        </Routes>
      </MainContainer>
    </Router>
  );
}

export default App;