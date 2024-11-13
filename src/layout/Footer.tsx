import { Container, Paper, Typography } from '@mui/material';
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <Paper
      elevation={5}
      sx={{
        marginTop: 'auto',
        padding: '30px 0',
      }}
    >
      <Container maxWidth="md">
        <Typography variant="body1" align="center">
          Aldi-Dev © {new Date().getFullYear()}
        </Typography>
      </Container>
    </Paper>
  );
};
