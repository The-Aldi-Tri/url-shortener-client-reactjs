import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  TextField,
} from '@mui/material';
import { AxiosError } from 'axios';
import { useFormik } from 'formik';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { signUpSchema } from '../../schemas/signUpSchema';
import axiosInstance from '../../utils/axiosInstance';

export const AuthSignUpForm: React.FC = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = React.useState(false);

  const signUpFormik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: signUpSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);

      try {
        const { data } = await axiosInstance.post('/auth/signup', values);

        toast.success('Sign up success');

        await toast.promise(
          axiosInstance.post(
            '/mail/send',
            { email: data.data.email },
            { timeout: 10000 },
          ),
          {
            pending: 'Sending mail...',
            success: 'Mail sent',
            error: 'An unexpected error occurred',
          },
        );

        navigate(`/verify/${data.data._id}`);
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
      component="form"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        paddingY: '20px',
        alignItems: 'center',
      }}
      onSubmit={signUpFormik.handleSubmit}
    >
      <TextField
        id="signUp-username"
        label="Username"
        type="text"
        variant="outlined"
        required
        sx={{ width: '75%' }}
        name="username"
        value={signUpFormik.values.username}
        error={
          signUpFormik.touched.username && Boolean(signUpFormik.errors.username)
        }
        helperText={
          signUpFormik.touched.username && signUpFormik.errors.username
        }
        onBlur={signUpFormik.handleBlur}
        onChange={signUpFormik.handleChange}
      />
      <TextField
        id="signUp-email"
        label="Email"
        type="email"
        variant="outlined"
        required
        sx={{ width: '75%' }}
        name="email"
        value={signUpFormik.values.email}
        error={signUpFormik.touched.email && Boolean(signUpFormik.errors.email)}
        helperText={signUpFormik.touched.email && signUpFormik.errors.email}
        onBlur={signUpFormik.handleBlur}
        onChange={signUpFormik.handleChange}
      />
      <FormControl variant="outlined" required sx={{ width: '75%' }}>
        <InputLabel
          htmlFor="signUp-password"
          error={
            signUpFormik.touched.password &&
            Boolean(signUpFormik.errors.password)
          }
        >
          Password
        </InputLabel>
        <OutlinedInput
          id="signUp-password"
          label="password"
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={signUpFormik.values.password}
          error={
            signUpFormik.touched.password &&
            Boolean(signUpFormik.errors.password)
          }
          onBlur={signUpFormik.handleBlur}
          onChange={signUpFormik.handleChange}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword((show) => !show)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
        <FormHelperText
          error={Boolean(
            signUpFormik.touched.password && signUpFormik.errors.password,
          )}
        >
          {signUpFormik.touched.password && signUpFormik.errors.password}
        </FormHelperText>
      </FormControl>
      <FormControl variant="outlined" required sx={{ width: '75%' }}>
        <InputLabel
          htmlFor="signUp-confirmPassword"
          error={
            signUpFormik.touched.confirmPassword &&
            Boolean(signUpFormik.errors.confirmPassword)
          }
        >
          Confirm Password
        </InputLabel>
        <OutlinedInput
          id="signUp-confirmPassword"
          label="confirm password"
          type={showPassword ? 'text' : 'password'}
          name="confirmPassword"
          value={signUpFormik.values.confirmPassword}
          error={
            signUpFormik.touched.confirmPassword &&
            Boolean(signUpFormik.errors.confirmPassword)
          }
          onBlur={signUpFormik.handleBlur}
          onChange={signUpFormik.handleChange}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword((show) => !show)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
        <FormHelperText
          error={Boolean(
            signUpFormik.touched.confirmPassword &&
              signUpFormik.errors.confirmPassword,
          )}
        >
          {signUpFormik.touched.confirmPassword &&
            signUpFormik.errors.confirmPassword}
        </FormHelperText>
      </FormControl>
      <Button
        type="submit"
        variant="contained"
        sx={{ width: '75%' }}
        disabled={signUpFormik.isSubmitting}
      >
        {signUpFormik.isSubmitting ? 'Signing up...' : 'Sign Up'}
      </Button>
    </Box>
  );
};
