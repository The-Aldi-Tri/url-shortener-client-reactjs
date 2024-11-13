import { Box, Button, ButtonGroup, Container, Paper } from '@mui/material';
import React from 'react';
import { AuthLoginForm } from './AuthLoginForm';
import { AuthSignUpForm } from './AuthSignUpForm';

export const Auth: React.FC = () => {
  const [authType, setAuthType] = React.useState<'signUp' | 'login'>('signUp');

  return (
    <Container
      component={Paper}
      elevation={3}
      maxWidth="sm"
      sx={{ gap: '20px', paddingY: '20px' }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'center', paddingY: '20px' }}>
        <ButtonGroup aria-label="Basic button group">
          <Button
            onClick={() => setAuthType('signUp')}
            variant={authType === 'signUp' ? 'contained' : 'outlined'}
          >
            SIgnUp
          </Button>
          <Button
            onClick={() => setAuthType('login')}
            variant={authType === 'login' ? 'contained' : 'outlined'}
          >
            Login
          </Button>
        </ButtonGroup>
      </Box>
      {authType === 'signUp' ? <AuthSignUpForm /> : <AuthLoginForm />}
    </Container>
  );
};