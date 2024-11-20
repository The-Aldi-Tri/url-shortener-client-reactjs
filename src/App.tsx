import { CssBaseline } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React from 'react';
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';
import { Auth } from './components/Auth/Auth';
import { NotFound } from './components/NotFound';
import { Profile } from './components/Profile/Profile';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RedirectExternal } from './components/RedirectExternal';
import { Url } from './components/Url/Url';
import { VerifyAccount } from './components/VerifyAccount/VerifyAccount';
import { AppLayout } from './layout/AppLayout';
import { useAuthStore } from './stores/useAuthStore';

import 'react-toastify/dist/ReactToastify.css';

const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <Url />,
      },
      {
        path: '/auth',
        element: useAuthStore.getState().token ? (
          <Navigate to="/" replace />
        ) : (
          <Auth />
        ),
      },
      {
        element: <ProtectedRoute />,
        children: [
          {
            path: '/profile',
            element: <Profile />,
          },
        ],
      },
      {
        path: '/urls/:shorten',
        element: <RedirectExternal />,
      },
      {
        path: '/verify/:userId',
        element: useAuthStore.getState().token ? (
          <Navigate to="/" replace />
        ) : (
          <VerifyAccount />
        ),
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

const queryClient = new QueryClient();

const theme = createTheme({
  colorSchemes: {
    dark: true,
  },
});

export const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
      <ToastContainer
        position="top-center"
        pauseOnFocusLoss={false}
        pauseOnHover={false}
        hideProgressBar={true}
        autoClose={3000}
        stacked
        theme="colored"
        transition={Slide}
      />
    </ThemeProvider>
  );
};
