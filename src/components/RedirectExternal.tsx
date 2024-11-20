import { Button, CircularProgress, Container, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';

const getOriginalUrl = async (shorten: string): Promise<string> => {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  const { data } = await axiosInstance.get(`/urls/${shorten}`);
  return data.data;
};

export const RedirectExternal = () => {
  const { shorten } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['url', shorten],
    queryFn: () => getOriginalUrl(shorten!),
    enabled: !!shorten,
    retry: 1,
  });

  React.useEffect(() => {
    if (data) {
      setTimeout(() => {
        window.location.assign(data);
      }, 1000);
    }
  }, [data]);

  return (
    <Container
      maxWidth="md"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      {isLoading && (
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          {'Getting url... '}
          <CircularProgress />
        </Typography>
      )}
      {isError && (
        <>
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            Url not found
          </Typography>
          <br></br>
          <Button variant="contained" onClick={() => navigate('/')}>
            Go to Home
          </Button>
        </>
      )}
      {data && (
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          {'Url found. Redirecting... '}
          <CircularProgress />
        </Typography>
      )}
    </Container>
  );
};
