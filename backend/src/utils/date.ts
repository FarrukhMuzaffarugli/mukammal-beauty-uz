import ms from 'ms';

export const toExpiryDate = (expiresIn: string): Date => {
  const duration = ms(expiresIn);
  if (typeof duration !== 'number') {
    throw new Error(`Invalid duration provided: ${expiresIn}`);
  }
  const now = Date.now();
  return new Date(now + duration);
};
