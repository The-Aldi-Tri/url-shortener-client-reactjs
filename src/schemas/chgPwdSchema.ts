import * as Yup from 'yup';

export const chgPwdSchema = Yup.object().shape({
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

  newPassword: Yup.string()
    .min(8, 'At least 8 characters long')
    .matches(/[a-z]/, 'At least one lowercase letter')
    .matches(/[A-Z]/, 'At least one uppercase letter')
    .matches(/[0-9]/, 'At least one number')
    .matches(
      /[-#!$@£%^&*()_+|~=`{}[\]:";'<>?,./\\ ]/,
      'At least one special character',
    )
    .required('New password is required')
    .notOneOf(
      [Yup.ref('password')],
      'New Password must different from previous',
    ),
});
