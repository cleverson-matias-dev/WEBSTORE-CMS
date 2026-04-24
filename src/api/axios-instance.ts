import axios, { type AxiosRequestConfig, AxiosError } from 'axios';
import { useAuthStore } from '@/store/auth-store';
import { postIdentityApiV1UsersAuthRefresh } from './gen/identity/autenticação/autenticação';
// Importe a função de refresh gerada pelo Orval

export const AXIOS_INSTANCE = axios.create({ 
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000' 
});

// --- Request Interceptor ---
AXIOS_INSTANCE.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Response Interceptor: Lógica de Refresh ---
AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Se erro 401 e não for uma tentativa de retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = useAuthStore.getState().refreshToken;

      if (refreshToken) {
        try {
          // Chamada ao endpoint de refresh usando a função gerada pelo Orval
          // Note que passamos o DTO esperado { refreshToken }
          const response = await postIdentityApiV1UsersAuthRefresh({ 
            refreshToken 
          });

          // Atualiza a store com os novos dados
          useAuthStore.getState().setAuth(
            response.user, 
            response.token, 
            response.refreshToken
          );

          // Atualiza o header da requisição original e tenta novamente
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${response.token}`;
          }
          
          console.log(originalRequest.headers?.Authorization, response.token)
          return AXIOS_INSTANCE(originalRequest); 

        } catch (refreshError) {
          // Se o refresh falhar (ex: refresh token expirado), desloga o usuário
          useAuthStore.getState().clearAuth();
          return Promise.reject(refreshError);
        }
      } else {
        useAuthStore.getState().clearAuth();
      }
    }

    return Promise.reject(error);
  }
);

export const customInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig,
): Promise<T> => {
  const source = axios.CancelToken.source();
  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }) => data);

  // @ts-expect-error axios error
  promise.cancel = () => {
    source.cancel('Query was cancelled');
  };

  return promise;
};
