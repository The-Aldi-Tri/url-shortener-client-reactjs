import * as Yup from 'yup';

// Define the validation schema
export const signUpSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'At least 3 characters long')
    .max(30, 'Maximum 30 characters')
    .matches(
      /^[a-zA-Z0-9-_]+$/,
      'Must be alphanumeric and may contain hyphens and underscores',
    )
    .required('Username is required'),

  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),

  password: Yup.string()
    .min(8, 'At least 8 characters long')
    .matches(/[a-z]/, 'At least one lowercase letter')
    .matches(/[A-Z]/, 'At least one uppercase letter')
    .matches(/[0-9]/, 'At least one number')
    .matches(
      /[-#!$@£%^&*()_+|~=`{}[\]:";'<>?,./\\ ]/,
      'At least one special character',
    )
    .required('Password is required'),

  // Special character (-#!$@£%^&*()_+|~=`{}[]/\\ )

  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Confirm Password is required'),
});
