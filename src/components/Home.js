// src/components/Home.js
import React from 'react';
import { Typography, Container, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { ReactComponent as Logo } from '../logo.svg'; // Ensure the path is correct

// Styled Components
const StyledContainer = styled(Container)`
  padding: 40px 20px;
  text-align: center;

  @media (max-width: 600px) {
    padding: 20px 10px;
  }
`;

const LogoContainer = styled.div`
  margin-bottom: 20px;

  svg {
    height: 150px;
    width: 150px;

    @media (max-width: 600px) {
      height: 100px;
      width: 100px;
    }
  }
`;

const Home = () => {
  return (
    <StyledContainer maxWidth="md">
      {/* Logo */}
      <LogoContainer>
        <Logo />
      </LogoContainer>
      {/* Headings */}
      <Typography variant="h6" gutterBottom>
        Welcome to
      </Typography>
      <Typography variant="h6" gutterBottom>
      Save The World With Art™
      </Typography>
      <Typography variant="h8" gutterBottom>
        Empowering artists to create and manage their own on-chain Tezos NFTs effortlessly.
      </Typography>

      {/* Call-to-Action Button */}
      <Box mt={4}>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          to="/generate"
          size="large"
          fullWidth
          sx={{
            maxWidth: '300px',
            padding: '10px 20px',
            fontSize: '1rem',
          }}
        >
          Get Started
        </Button>
      </Box>
    </StyledContainer>
  );
};

export default Home;
