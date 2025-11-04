import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthTokens } from '@/types';

const TOKEN_KEY = 'beautyuz/tokens';

export const authStorage = {
  async getTokens(): Promise<AuthTokens | null> {
    try {
      const raw = await AsyncStorage.getItem(TOKEN_KEY);
      return raw ? (JSON.parse(raw) as AuthTokens) : null;
    } catch (error) {
      console.warn('Failed to load tokens', error);
      return null;
    }
  },
  async setTokens(tokens: AuthTokens | null): Promise<void> {
    try {
      if (!tokens) {
        await AsyncStorage.removeItem(TOKEN_KEY);
      } else {
        await AsyncStorage.setItem(TOKEN_KEY, JSON.stringify(tokens));
      }
    } catch (error) {
      console.warn('Failed to persist tokens', error);
    }
  }
};
