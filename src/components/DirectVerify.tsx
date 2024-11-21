import {
  Alert,
  Button,
  CircularProgress,
  Container,
  Paper,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../utils/axiosInstance';

const verify = async (userId: string, verificationCode: number) => {
  const { data } = await axiosInstance.post('/mail/verify', {
    userId,
    verificationCode,
  });
  return data;
};

export const DirectVerify: React.FC = () => {
  const [searchParams] = useSearchParams();

  const userId = searchParams.get('userId');
  const verificationCode = parseInt(
    searchParams.get('verificationCode') ?? '0',
  );

  const { data, isLoading, isError } = useQuery({
    queryKey: ['directVerify', userId, verificationCode],
    queryFn: () => verify(userId!, verificationCode!),
    gcTime: 0,
    staleTime: 0,
    enabled: !!userId && !!verificationCode,
  });

  const navigate = useNavigate();

  React.useEffect(() => {
    if (!userId || !verificationCode || isError) {
      toast.warning('Verification failed');
      navigate('/auth', { replace: true });
    }
  }, [navigate, userId, verificationCode, isError]);

  return (
    <Container
      component={Paper}
      elevation={3}
      maxWidth="md"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingY: '20px',
      }}
    >
      {isLoading && <CircularProgress />}
      {data && (
        <>
          <Alert severity="success">Verification success</Alert>
          <Button
            variant="contained"
            sx={{ marginTop: '20px' }}
            onClick={() => navigate('/auth', { state: 'login', replace: true })}
          >
            Go Login
          </Button>
        </>
      )}
    </Container>
  );
};
