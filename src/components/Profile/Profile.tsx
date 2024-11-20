import { Box, Button, Container, Paper, Typography } from '@mui/material';
import { AxiosError } from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuthStore } from '../../stores/useAuthStore';
import axiosInstance from '../../utils/axiosInstance';
import { ConfirmationDialog } from '../ConfirmationDialog';
import { ProfileChangePasswordDialog } from './ProfileChangePasswordDIalog';
import { ProfileUpdateForm } from './ProfileUpdateForm';

export const Profile: React.FC = () => {
  const { clearToken } = useAuthStore();

  const navigate = useNavigate();

  const handleDelete = async () => {
    try {
      await axiosInstance.delete('/users');

      toast.success('User deleted successfully.');

      clearToken();

      navigate('/auth');
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.warning(
          error.response?.data.message ??
            'A server error occurred. Please try again later.',
        );
      } else {
        toast.error('An unexpected error occurred.');
      }
    }
  };

  const [openDialog, setOpenDialog] = React.useState<boolean>(false);

  return (
    <Container
      component={Paper}
      elevation={3}
      maxWidth="sm"
      sx={{
        gap: '20px',
        paddingY: '20px',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '20px',
        }}
      >
        <Typography variant="h5">User Profile</Typography>
        <ProfileUpdateForm />
        <Box
          sx={{
            width: '75%',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <ProfileChangePasswordDialog />
        </Box>
        <Box
          sx={{
            width: '75%',
            display: 'flex',
            justifyContent: 'flex-end',
          }}
        >
          <Button
            variant="contained"
            color="error"
            onClick={() => setOpenDialog(true)}
          >
            Delete Account
          </Button>
          <ConfirmationDialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            onConfirm={handleDelete}
            title="Confirm Account Deletion"
            message={`Are you sure you want to delete your account?`}
          />
        </Box>
      </Box>
    </Container>
  );
};
