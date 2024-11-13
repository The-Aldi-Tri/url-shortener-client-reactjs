import { Box } from '@mui/material';
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Body } from './Body';
import { Footer } from './Footer';
import { Navbar } from './Navbar';

export const AppLayout: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Navbar />
      <Body>
        <Outlet />
      </Body>
      <Footer />
    </Box>
  );
};
