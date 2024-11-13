import * as Yup from 'yup';

export const urlSchema = Yup.object().shape({
  origin: Yup.string()
    .matches(
      /^(https?:\/\/)/, // Ensure the URL starts with http:// or https://
      'URL must start with http:// or https://',
    )
    .url('Invalid URL')
    .required('Required'),
  shorten: Yup.string()
    .min(3, 'At least 3 characters long')
    .max(30, 'Maximum 30 characters')
    .matches(
      /^[a-zA-Z0-9-_]+$/,
      'Must be alphanumeric and may contain hyphens and underscores',
    )
    .required('Shorten is required'),
});
