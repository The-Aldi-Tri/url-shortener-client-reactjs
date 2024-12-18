import { Box, Button, TextField, Typography } from '@mui/material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { useFormik } from 'formik';
import React from 'react';
import { toast } from 'react-toastify';
import { urlSchema } from '../../schemas/urlSchema';
import { useAuthStore } from '../../stores/useAuthStore';
import axiosInstance from '../../utils/axiosInstance';

type CreateUrl = {
  origin: string;
  shorten: string;
};

const createUrl = async (values: CreateUrl): Promise<void> => {
  await axiosInstance.post('/urls', values);
};

export const UrlForm: React.FC = () => {
  const { token } = useAuthStore();
  const queryClient = useQueryClient();
  const createUrlMutation = useMutation({
    mutationFn: (data: CreateUrl) => createUrl(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['urls'] });
    },
    onError: () => {
      if (!token) {
        toast.warning('Please sign up or log in to continue');
      }
    },
  });

  const urlFormik = useFormik({
    initialValues: {
      origin: '',
      shorten: '',
    },
    validationSchema: urlSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);

      try {
        await createUrlMutation.mutateAsync(values);

        toast.success('Create Url success.');
      } catch (error) {
        if (!(error instanceof AxiosError)) {
          toast.error('An unexpected error occurred.');
          return;
        }

        toast.warning(
          error.response?.data.message ??
            'A server error occurred. Please try again later.',
        );
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <Typography variant="h5">Url Shortener</Typography>
      <Box
        component="form"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          paddingY: '20px',
          alignItems: 'center',
          width: '100%',
        }}
        onSubmit={urlFormik.handleSubmit}
      >
        <TextField
          id="url-origin"
          label="Original Url"
          type="text"
          variant="outlined"
          required
          sx={{ width: '75%' }}
          name="origin"
          value={urlFormik.values.origin}
          error={urlFormik.touched.origin && Boolean(urlFormik.errors.origin)}
          helperText={urlFormik.touched.origin && urlFormik.errors.origin}
          onBlur={urlFormik.handleBlur}
          onChange={urlFormik.handleChange}
        />
        <TextField
          id="url-shorten"
          label="Shorten Url"
          type="text"
          variant="outlined"
          required
          sx={{ width: '75%' }}
          name="shorten"
          value={urlFormik.values.shorten}
          error={urlFormik.touched.shorten && Boolean(urlFormik.errors.shorten)}
          helperText={urlFormik.touched.shorten && urlFormik.errors.shorten}
          onBlur={urlFormik.handleBlur}
          onChange={urlFormik.handleChange}
        />
        <Button
          type="submit"
          variant="contained"
          sx={{ width: '75%' }}
          disabled={urlFormik.isSubmitting}
        >
          {urlFormik.isSubmitting ? 'Shortening...' : 'Shorten it'}
        </Button>
      </Box>
    </Box>
  );
};
