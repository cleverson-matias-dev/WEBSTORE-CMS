import type { UserResponseDTO } from '@/api/gen/identity/model';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  refreshToken: string | null;
  user: UserResponseDTO | null;
  // Aceita valores opcionais para facilitar o uso com a resposta da API
  setAuth: (user?: UserResponseDTO, token?: string, refreshToken?: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      refreshToken: null,

      setAuth: (user, token, refreshToken) => set({ 
        user: user ?? null, 
        token: token ?? null,
        refreshToken: refreshToken ?? null
      }),

      clearAuth: () => set({ 
        user: null, 
        token: null,
        refreshToken: null
      }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
