import { Alert, Box, Button, CircularProgress, TextField } from '@mui/material';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { Formik } from 'formik';
import React from 'react';
import { toast } from 'react-toastify';
import { profileSchema } from '../../schemas/profileSchema';
import axiosInstance from '../../utils/axiosInstance';

type User = {
  _id: string;
  email: string;
  username: string;
  createdAt: Date;
  updatedAt: Date;
};

const fetchUser = async (): Promise<User> => {
  const { data } = await axiosInstance.get('/users');
  const user = data.data as Record<keyof User, string>;
  return {
    ...user,
    createdAt: new Date(user.createdAt),
    updatedAt: new Date(user.updatedAt),
  };
};

const updateUser = async (values: Partial<User>): Promise<User> => {
  const { data } = await axiosInstance.patch('/users', values);
  const user = data.data as Record<keyof User, string>;
  return {
    ...user,
    createdAt: new Date(user.createdAt),
    updatedAt: new Date(user.updatedAt),
  };
};

export const ProfileUpdateForm: React.FC = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
  });

  const queryClient = useQueryClient();
  const updateUserMutation = useMutation({
    mutationFn: (data: Partial<User>) => updateUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  });

  if (isLoading) {
    return <CircularProgress />;
  }
  if (isError) {
    return <Alert severity="error">Error loading user data.</Alert>;
  }
  return (
    <Formik
      initialValues={{
        ...data,
      }}
      validationSchema={profileSchema}
      onSubmit={async (values, { setSubmitting, resetForm }) => {
        try {
          setSubmitting(true);

          await updateUserMutation.mutateAsync(values, {
            onSuccess: (data) => resetForm({ values: data }),
          });

          toast.success('Update user success.');
        } catch (error) {
          if (error instanceof AxiosError && error.status === 409) {
            toast.warning(error.response?.data.message);
            return;
          }
          toast.error('Update user failed. Please try again later.');
        }

        setSubmitting(false);
      }}
    >
      {({
        values,
        errors,
        touched,
        dirty,
        handleChange,
        handleBlur,
        handleSubmit,
        resetForm,
        isSubmitting,
      }) => (
        <Box
          component="form"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            alignItems: 'center',
            width: '100%',
          }}
          onSubmit={handleSubmit}
        >
          <TextField
            id="profile-id"
            label="User ID"
            type="text"
            variant="outlined"
            disabled={true}
            sx={{ width: '75%' }}
            name="_id"
            value={values._id}
          />
          <TextField
            id="profile-username"
            label="Username"
            type="text"
            variant="outlined"
            required
            sx={{ width: '75%' }}
            name="username"
            value={values.username}
            error={touched.username && Boolean(errors.username)}
            helperText={touched.username && errors.username}
            onBlur={handleBlur}
            onChange={handleChange}
          />
          <TextField
            id="profile-email"
            label="Email"
            type="text"
            variant="outlined"
            required
            sx={{ width: '75%' }}
            name="email"
            value={values.email}
            error={touched.email && Boolean(errors.email)}
            helperText={touched.email && errors.email}
            onBlur={handleBlur}
            onChange={handleChange}
          />
          <TextField
            id="profile-createdAt"
            label="Created At"
            type="text"
            variant="outlined"
            disabled={true}
            sx={{ width: '75%' }}
            name="createdAt"
            value={values.createdAt!.toLocaleString('en-GB', {
              timeZoneName: 'short',
            })}
          />
          <TextField
            id="profile-updatedAt"
            label="Updated At"
            type="text"
            variant="outlined"
            disabled={true}
            sx={{ width: '75%' }}
            name="updatedAt"
            value={values.updatedAt!.toLocaleString('en-GB', {
              timeZoneName: 'short',
            })}
          />
          <Box
            sx={{
              width: '75%',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
            }}
          >
            <Button
              variant="outlined"
              disabled={!dirty || isSubmitting}
              onClick={() => resetForm()}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={!dirty || isSubmitting}
            >
              {isSubmitting ? 'Updating..' : 'Update'}
            </Button>
          </Box>
        </Box>
      )}
    </Formik>
  );
};
