import { Box, Button, Grid2, TextField, Typography } from '@mui/material';
import { AxiosError } from 'axios';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from '../../utils/axiosInstance';

export const VerifyAccountForm = ({
  email,
  username,
}: Record<string, string>) => {
  const [verifyCode, setVerifyCode] = React.useState(Array(6).fill(''));
  const [loading, setLoading] = React.useState(false);
  const [disableResend, setDisableResend] = React.useState(false);
  const [resendTimer, setResendTimer] = React.useState<number>(0);

  // Refs to hold references to each Verification Code input field
  const verifyCodeRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    index: number,
  ) => {
    const value = e.target.value;
    if (/[^0-9]/.test(value)) return; // Allow only numeric input

    const newVerifyCode = [...verifyCode];
    newVerifyCode[index] = value;
    setVerifyCode(newVerifyCode);

    // If the digit is filled and there is a next input, focus on the next field
    if (value && verifyCodeRefs.current[index + 1]) {
      verifyCodeRefs.current[index + 1]?.focus();
    }
    // If the field is empty and there is a previous input, focus on the previous input
    else if (!value && verifyCodeRefs.current[index - 1]) {
      verifyCodeRefs.current[index - 1]?.focus();
    }
  };

  const navigate = useNavigate();

  // Handle OTP submission
  const handleSubmit = async () => {
    setLoading(true);

    const verificationCodeNumber = parseInt(verifyCode.join(''), 10);

    try {
      await axiosInstance.post('/mail/verify', {
        email,
        verificationCode: verificationCodeNumber,
      });

      toast.success('Account verification success.');

      navigate('/auth', { state: 'login' });
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
      setLoading(false);
    }
  };

  // Handle resend OTP
  const handleResend = async () => {
    setDisableResend(true);

    // Set the resend timer to 30 seconds (30000ms)
    const resendTimeout = Date.now() + 30000;
    setResendTimer(30);

    // Start the countdown for re-enabling the resend button
    const countdown = setInterval(() => {
      const timeLeft = resendTimeout - Date.now();
      if (timeLeft <= 0) {
        setDisableResend(false);
        clearInterval(countdown);
      } else {
        setResendTimer(Math.ceil(timeLeft / 1000)); // Update time left in seconds
      }
    }, 1000); // Update every second

    // Call API to resend the OTP
    await toast.promise(
      axiosInstance.post('/mail/send', { email }, { timeout: 10000 }),
      {
        pending: 'Sending mail...',
        success: 'Mail sent',
        error: 'An unexpected error occurred',
      },
    );
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        alignItems: 'center',
      }}
    >
      <Typography variant="h5">Verify Your Account</Typography>
      <Typography variant="body2" color="textSecondary">
        Hi, <strong>{username}</strong>. A 6-digit verification code has been
        sent to your email - <strong>{email}</strong>.
      </Typography>
      <Typography variant="body2" color="textSecondary">
        Enter the code
      </Typography>
      <Grid2 container spacing={1} justifyContent="center">
        {verifyCode.map((digit, index) => (
          <Grid2 key={index} sx={{ width: '40px' }}>
            <TextField
              id={`verifyCode-input-${index}`}
              value={digit}
              onChange={(e) => handleChange(e, index)}
              onFocus={(e) => e.target.select()} // Select text when focused
              inputRef={(el) => (verifyCodeRefs.current[index] = el)} // Assign ref to input
              variant="outlined"
              slotProps={{
                htmlInput: {
                  maxLength: 1,
                  style: { textAlign: 'center', fontSize: '1.5rem' },
                },
              }}
            />
          </Grid2>
        ))}
      </Grid2>
      <Typography variant="body2" color="textSecondary">
        Didn't get the code?
        <Button
          size="small"
          disabled={disableResend}
          onClick={handleResend}
          variant="outlined"
          sx={{ ml: 2 }}
        >
          {disableResend ? resendTimer : 'Resend'}
        </Button>
      </Typography>
      <Button
        fullWidth
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? 'Verifying...' : 'Verify'}
      </Button>
    </Box>
  );
};
