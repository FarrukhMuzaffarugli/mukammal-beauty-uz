import axios from 'axios';
import { AuthTokens } from '@/types';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api';
const TOKEN_KEY = 'beautyuz/adminTokens';

const client = axios.create({
  baseURL: API_URL,
  withCredentials: false
});

const getTokens = (): AuthTokens | null => {
  const raw = localStorage.getItem(TOKEN_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthTokens;
  } catch (error) {
    return null;
  }
};

const setTokens = (tokens: AuthTokens | null) => {
  if (!tokens) {
    localStorage.removeItem(TOKEN_KEY);
  } else {
    localStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
  }
};

let refreshPromise: Promise<AuthTokens | null> | null = null;

const refreshTokens = async (): Promise<AuthTokens | null> => {
  if (refreshPromise) return refreshPromise;
  const tokens = getTokens();
  if (!tokens) return null;

  refreshPromise = (async () => {
    try {
      const response = await axios.post(`${API_URL}/auth/refresh`, {
        refreshToken: tokens.refreshToken
      });
      const nextTokens = response.data.tokens as AuthTokens;
      setTokens(nextTokens);
      return nextTokens;
    } catch (error) {
      setTokens(null);
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
};

client.interceptors.request.use((config) => {
  const tokens = getTokens();
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
    const original = error.config;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      const tokens = await refreshTokens();
      if (tokens?.accessToken) {
        original.headers.Authorization = `${tokens.tokenType} ${tokens.accessToken}`;
        return client(original);
      }
    }
    return Promise.reject(error);
  }
);

export { client, getTokens, setTokens, API_URL, TOKEN_KEY };
