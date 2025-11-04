import axios from 'axios';
import { env } from '@/config/env';
import { tokenManager } from '@/lib/tokenManager';
import { AuthTokens } from '@/types';

const client = axios.create({
  baseURL: env.apiUrl,
  timeout: 10000
});

let refreshPromise: Promise<AuthTokens | null> | null = null;

const refreshTokens = async (): Promise<AuthTokens | null> => {
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    const tokens = tokenManager.getTokens();
    if (!tokens) return null;

    try {
      const response = await axios.post(
        `${env.apiUrl}/auth/refresh`,
        { refreshToken: tokens.refreshToken },
        { timeout: 8000 }
      );
      const nextTokens = response.data.tokens as AuthTokens;
      await tokenManager.setTokens(nextTokens);
      return nextTokens;
    } catch (error) {
      await tokenManager.setTokens(null);
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

client.interceptors.request.use(async (config) => {
  await tokenManager.hydrate();
  const tokens = tokenManager.getTokens();
  if (tokens?.accessToken) {
    config.headers = {
      ...config.headers,
      Authorization: `${tokens.tokenType} ${tokens.accessToken}`
    };
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response, config } = error;
    if (response?.status === 401 && !config._retry) {
      config._retry = true;
      const tokens = await refreshTokens();
      if (tokens?.accessToken) {
        config.headers.Authorization = `${tokens.tokenType} ${tokens.accessToken}`;
        return client(config);
      }
    }

    return Promise.reject(error);
  }
);

export { client };
