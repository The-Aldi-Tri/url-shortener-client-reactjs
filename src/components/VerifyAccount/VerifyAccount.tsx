import { CircularProgress, Container, Paper } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { VerifyAccountForm } from './VerifyAccountForm';

const fetchUserEmail = async (
  userId: string,
): Promise<{ email: string; is_verified: boolean; username: string }> => {
  const { data } = await axiosInstance.post(`/users`, { _id: userId });
  return data.data;
};

export const VerifyAccount: React.FC = () => {
  const { userId } = useParams();
  const isValidUserId = /^[0-9a-fA-F]{24}$/.test(userId!);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['verify', userId],
    queryFn: () => fetchUserEmail(userId!),
    enabled: !!userId && isValidUserId,
  });

  const navigate = useNavigate();

  React.useEffect(() => {
    if (!isValidUserId || isError) {
      navigate('/auth', { replace: true });
    }
  }, [isError, isValidUserId, navigate]);

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
        <VerifyAccountForm email={data.email} username={data.username} />
      )}
    </Container>
  );
};
