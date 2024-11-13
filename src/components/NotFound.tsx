import { Button, Container, Typography } from '@mui/material';
import React from 'react';

import { useNavigate } from 'react-router-dom';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container
      maxWidth="md"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '20px',
        flexGrow: '1',
      }}
    >
      <Typography variant="h2" sx={{ fontWeight: 700 }}>
        404 - Page Not Found
      </Typography>
      <Button variant="contained" onClick={() => navigate('/')}>
        Go to Home
      </Button>
    </Container>
  );
};
