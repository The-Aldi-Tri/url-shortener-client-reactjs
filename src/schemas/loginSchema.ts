import * as Yup from 'yup';

export const loginSchema = Yup.object().shape({
  usernameOrEmail: Yup.string()
    .required('Username or Email is required')
    .test(
      'is-email-or-username',
      'Invalid Username or Email',
      function (value) {
        const { createError } = this; // Get the createError method from context
        if (!value) return true; // If value is empty, skip validation (handled by required)

        if (value.includes('@')) {
          // Validate as email
          return (
            Yup.string().email().isValidSync(value) ||
            createError({ message: 'Invalid email address' })
          );
        } else {
          // Validate as username
          const schema = Yup.string()
            .min(3, 'Username at least 3 characters long')
            .max(30, 'Username maximum 30 characters')
            .matches(
              /^[a-zA-Z0-9-_]+$/,
              'Username must be alphanumeric and may contain hyphens and underscores',
            );

          try {
            schema.validateSync(value);
            return true;
          } catch (error) {
            const errorMsg = (error as Yup.ValidationError).errors[0];
            return createError({ message: errorMsg });
          }
        }
      },
    ),

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
});
