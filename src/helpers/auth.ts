import { ACCESS_KEY, EXPIRE_KEY, REFRESH_KEY } from '@/constants/secure';
import * as SecureStore from 'expo-secure-store';

export const tokenActions = {
  saveTokens: async (
    access: string,
    refresh: string,
    expires_in: number = 3600,
  ) => {
    try {
      const absoluteExpiresAt = Date.now() + expires_in * 1000;
      await SecureStore.setItemAsync(ACCESS_KEY, access);
      await SecureStore.setItemAsync(EXPIRE_KEY, String(absoluteExpiresAt));
      await SecureStore.setItemAsync(REFRESH_KEY, refresh);
    } catch (error) {
      console.error('AN ERROR OCCURED WHILE SAVING TOKENS', error);
    }
  },
  getToken: async (type: 'access' | 'refresh' | 'expires_in') => {
    try {
      if (type === 'access') {
        return await SecureStore.getItemAsync(ACCESS_KEY);
      }
      if (type === 'refresh') {
        return await SecureStore.getItemAsync(REFRESH_KEY);
      }

      if (type === 'expires_in') {
        return await SecureStore.getItemAsync(EXPIRE_KEY);
      }
    } catch (error) {
      console.error('AN ERROR OCCURED WHILE GETTING TOKENS AND EXPIRE', error);
      return null;
    }
  },
  removeTokens: async () => {
    try {
      await SecureStore.deleteItemAsync(ACCESS_KEY);
      await SecureStore.deleteItemAsync(REFRESH_KEY);
      await SecureStore.deleteItemAsync(EXPIRE_KEY);
    } catch (error) {
      console.error('AN ERROR OCCURED WHILE REMOVING TOKENS', error);
    }
  },
};
