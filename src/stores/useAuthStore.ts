import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Token {
  accessToken: string;
  refreshToken: string;
}

interface AuthState {
  token: Token | null;
  setToken: (newToken: Token) => void;
  clearToken: () => void;
}

// Create the store using Zustand with persistence
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      setToken: (newToken) => {
        set({ token: newToken });
      },
      clearToken: () => {
        set({ token: null });
      },
    }),
    {
      name: 'auth-storage', // Unique name for the storage
    },
  ),
);
