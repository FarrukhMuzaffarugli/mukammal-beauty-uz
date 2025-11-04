import { AuthTokens } from '@/types';
import { authStorage } from '@/storage/authStorage';

class TokenManager {
  private tokens: AuthTokens | null = null;
  private isHydrated = false;

  async hydrate() {
    if (this.isHydrated) return;
    this.tokens = await authStorage.getTokens();
    this.isHydrated = true;
  }

  getTokens() {
    return this.tokens;
  }

  async setTokens(tokens: AuthTokens | null) {
    this.tokens = tokens;
    await authStorage.setTokens(tokens);
  }
}

export const tokenManager = new TokenManager();
