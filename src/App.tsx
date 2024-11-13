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
import { ToastContainer } from 'react-toastify';
import { Auth } from './components/Auth/Auth';
import { NotFound } from './components/NotFound';
import { Profile } from './components/Profile/Profile';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RedirectExternal } from './components/RedirectExternal.tsx';
import { Url } from './components/Url/Url.tsx';
import { AppLayout } from './layout/AppLayout.tsx';
import { useAuthStore } from './stores/useAuthStore.ts';

import 'react-toastify/dist/ReactToastify.css';

const queryClient = new QueryClient();

const theme = createTheme({
  colorSchemes: {
    dark: true,
  },
});

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
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

export const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
      <ToastContainer position="top-center" theme="colored" />
    </ThemeProvider>
  );
};
