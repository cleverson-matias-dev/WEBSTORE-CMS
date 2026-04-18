import axios, { type AxiosRequestConfig } from 'axios';

// Aqui você define a URL base da sua API
export const AXIOS_INSTANCE = axios.create({ 
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000' 
});

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
