// src/components/OnChainLicense.js

import React from 'react';
import styled from 'styled-components';
import { Paper } from '@mui/material';
import OnChainLicenseSVG from './OnChainLicenseSVG'; // Ensure the path is correct

// Styled Components
const Container = styled(Paper)`
  width: 100%;
  max-width: 850px;
  margin: 20px auto;
  padding: 20px;
  text-align: center;
  box-sizing: border-box;

  @media (max-width: 900px) {
    padding: 15px;
    max-width: 95%;
  }

  @media (max-width: 600px) {
    padding: 10px;
    max-width: 100%;
  }
`;

const ContractInfo = styled.div`
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: bold;
  word-wrap: break-word;
`;

const SVGContainer = styled.div`
  width: 100%;
  height: auto;
  overflow-x: hidden;

  svg {
    width: 100%;
    height: auto;
  }

  iframe {
    width: 100%;
    height: 400px;
    border: none;
  }
`;

const OnChainLicense = () => {
  const tezosContractNumber = 'KT1S9GHLCrGg5YwoJGDDuC347bCTikefZQ4z';

  return (
    <Container elevation={3}>
      <ContractInfo>
        <p>Tezos Contract Number: <strong>{tezosContractNumber}</strong></p>
      </ContractInfo>
      <SVGContainer>
        <OnChainLicenseSVG />
      </SVGContainer>
    </Container>
  );
};

export default OnChainLicense;
