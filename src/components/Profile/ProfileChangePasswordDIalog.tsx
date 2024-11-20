import { Visibility, VisibilityOff } from '@mui/icons-material';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
} from '@mui/material';
import { AxiosError } from 'axios';
import { useFormik } from 'formik';
import * as React from 'react';
import { toast } from 'react-toastify';
import { chgPwdSchema } from '../../schemas/chgPwdSchema';
import axiosInstance from '../../utils/axiosInstance';

export const ProfileChangePasswordDialog: React.FC = () => {
  const [openDialog, setOpenDialog] = React.useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const chgPwdFormik = useFormik({
    initialValues: {
      password: '',
      newPassword: '',
    },
    validationSchema: chgPwdSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);

      try {
        await axiosInstance.post('/auth/change-password', values);

        toast.success('Password changed successfully');

        resetForm();

        setOpenDialog(false);
      } catch (error) {
        if (error instanceof AxiosError) {
          toast.warning(
            error.response?.data.message ??
              'A server error occurred. Please try again later.',
          );
        } else {
          toast.error('An unexpected error occurred.');
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <React.Fragment>
      <Button
        variant="contained"
        color="warning"
        onClick={() => setOpenDialog(true)}
      >
        Change Password
      </Button>
      <Dialog
        open={openDialog}
        onClose={() => {
          setOpenDialog(false);
          chgPwdFormik.resetForm();
        }}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          component: 'form',
          onSubmit: (e: Event) => {
            e.preventDefault();
            chgPwdFormik.handleSubmit();
          },
        }}
      >
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent
          sx={{
            paddingX: '5%',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          <FormControl variant="standard" required>
            <InputLabel
              htmlFor="chgPwd-password"
              error={
                chgPwdFormik.touched.password &&
                Boolean(chgPwdFormik.errors.password)
              }
            >
              Password
            </InputLabel>
            <Input
              id="chgPwd-password"
              type={showPassword ? 'text' : 'password'}
              name="password"
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
              value={chgPwdFormik.values.password}
              error={
                chgPwdFormik.touched.password &&
                Boolean(chgPwdFormik.errors.password)
              }
              onBlur={chgPwdFormik.handleBlur}
              onChange={chgPwdFormik.handleChange}
            />
            <FormHelperText
              error={Boolean(
                chgPwdFormik.touched.password && chgPwdFormik.errors.password,
              )}
            >
              {chgPwdFormik.touched.password && chgPwdFormik.errors.password}
            </FormHelperText>
          </FormControl>
          <FormControl variant="standard" required>
            <InputLabel
              htmlFor="chgPwd-newPassword"
              error={
                chgPwdFormik.touched.newPassword &&
                Boolean(chgPwdFormik.errors.newPassword)
              }
            >
              New Password
            </InputLabel>
            <Input
              id="chgPwd-newPassword"
              type={showPassword ? 'text' : 'password'}
              name="newPassword"
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
              value={chgPwdFormik.values.newPassword}
              error={
                chgPwdFormik.touched.newPassword &&
                Boolean(chgPwdFormik.errors.newPassword)
              }
              onBlur={chgPwdFormik.handleBlur}
              onChange={chgPwdFormik.handleChange}
            />
            <FormHelperText
              error={Boolean(
                chgPwdFormik.touched.newPassword &&
                  chgPwdFormik.errors.newPassword,
              )}
            >
              {chgPwdFormik.touched.newPassword &&
                chgPwdFormik.errors.newPassword}
            </FormHelperText>
          </FormControl>
        </DialogContent>
        <DialogActions
          sx={{ gap: '5px', paddingRight: '5%', marginBottom: '10px' }}
        >
          <Button
            onClick={() => {
              setOpenDialog(false);
              chgPwdFormik.resetForm();
            }}
            variant="outlined"
            disabled={chgPwdFormik.isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={chgPwdFormik.isSubmitting}
          >
            {chgPwdFormik.isSubmitting ? 'Changing...' : 'Change'}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};
