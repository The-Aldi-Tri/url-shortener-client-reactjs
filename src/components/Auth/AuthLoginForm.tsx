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
import { loginSchema } from '../../schemas/loginSchema';
import { useAuthStore } from '../../stores/useAuthStore';
import axiosInstance from '../../utils/axiosInstance';

export const AuthLoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { setToken } = useAuthStore();

  const [showPassword, setShowPassword] = React.useState(false);

  const loginFormik = useFormik({
    initialValues: {
      usernameOrEmail: '',
      password: '',
    },
    validationSchema: loginSchema,
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      const { usernameOrEmail, password } = values;

      const identifier = usernameOrEmail.includes('@') ? 'email' : 'username';
      const loginReqBody = {
        [identifier]: usernameOrEmail,
        password: password,
      };

      try {
        const { data } = await axiosInstance.post('/auth/login', loginReqBody);

        setToken({
          accessToken: data.data['accessToken'],
          refreshToken: data.data['refreshToken'],
        });

        toast.success('Login success');
        navigate('/');
      } catch (error) {
        if (!(error instanceof AxiosError)) {
          toast.error('An unexpected error occurred.');
          return;
        }

        toast.warning(
          error.response?.data.message ??
            'A server error occurred. Please try again later.',
        );

        if (error.response?.status === 403) {
          const { data } = await axiosInstance.post(`/users`, {
            [identifier]: usernameOrEmail,
          });

          navigate(`/verify/${data.data._id}`);
        }
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
      onSubmit={loginFormik.handleSubmit}
    >
      <TextField
        id="login-usernameOrEmail"
        label="Username or Email"
        type="text"
        variant="outlined"
        required
        sx={{ width: '75%' }}
        name="usernameOrEmail"
        value={loginFormik.values.usernameOrEmail}
        error={
          loginFormik.touched.usernameOrEmail &&
          Boolean(loginFormik.errors.usernameOrEmail)
        }
        helperText={
          loginFormik.touched.usernameOrEmail &&
          loginFormik.errors.usernameOrEmail
        }
        onBlur={loginFormik.handleBlur}
        onChange={loginFormik.handleChange}
      />
      <FormControl variant="outlined" required sx={{ width: '75%' }}>
        <InputLabel
          htmlFor="login-password"
          error={
            loginFormik.touched.password && Boolean(loginFormik.errors.password)
          }
        >
          Password
        </InputLabel>
        <OutlinedInput
          id="login-password"
          label="password"
          type={showPassword ? 'text' : 'password'}
          name="password"
          value={loginFormik.values.password}
          error={
            loginFormik.touched.password && Boolean(loginFormik.errors.password)
          }
          onBlur={loginFormik.handleBlur}
          onChange={loginFormik.handleChange}
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
            loginFormik.touched.password && loginFormik.errors.password,
          )}
        >
          {loginFormik.touched.password && loginFormik.errors.password}
        </FormHelperText>
      </FormControl>
      <Button type="submit" variant="contained" sx={{ width: '75%' }}>
        {loginFormik.isSubmitting ? 'Logging in...' : 'Login'}
      </Button>
    </Box>
  );
};
