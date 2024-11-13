import * as Yup from 'yup';

// Define the validation schema
export const profileSchema = Yup.object().shape({
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
});
