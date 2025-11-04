import { env } from '@/config/env';

export const resolveImageUrl = (path: string | null | undefined) => {
  if (!path) return undefined;
  if (path.startsWith('http')) return path;
  return `${env.apiUrl.replace('/api', '')}/${path.replace(/^\/+/, '')}`;
};
