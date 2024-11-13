import { Container, Grid2, Paper } from '@mui/material';
import React from 'react';
import { UrlForm } from './UrlForm';
import { UrlTable } from './UrlTable';

export const Url: React.FC = () => {
  return (
    <Container
      component={Paper}
      elevation={3}
      maxWidth="lg"
      sx={{
        paddingY: '20px',
      }}
    >
      <Grid2 container spacing={5}>
        <Grid2
          size={{ xs: 12, sm: 12, md: 6 }}
          display="flex"
          justifyContent="center"
        >
          <UrlForm />
        </Grid2>
        <Grid2
          size={{ xs: 12, sm: 12, md: 6 }}
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <UrlTable />
        </Grid2>
      </Grid2>
    </Container>
  );
};
