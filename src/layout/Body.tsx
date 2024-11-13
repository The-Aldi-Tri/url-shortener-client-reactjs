import { Container } from '@mui/material';
import React, { ReactNode } from 'react';

interface WrapperProps {
  children: ReactNode;
}

export const Body: React.FC<WrapperProps> = ({ children }) => {
  return (
    <Container
      maxWidth="lg"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: '1',
        marginY: '20px',
      }}
    >
      {children}
    </Container>
  );
};
