import { tokenActions } from '@/helpers/auth';

import { USER_INFO_KEY } from '@/constants/storagekeys';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { getValidAccessToken } from './helpers/token';

const baseURL = `${process.env.EXPO_PUBLIC_API_URL}/rest/v1/`;
const apikey = process.env.EXPO_PUBLIC_API_KEY;

const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> =>
  Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('token-refresh-timeout')), ms),
    ),
  ]);

export const axiosInstance = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    apikey,
    Authorization: `Bearer ${apikey}`,
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const access_token = await withTimeout(getValidAccessToken(), 5000).catch(
      () => tokenActions.getToken('access'),
    );

    config.headers.Authorization = `Bearer ${access_token ?? apikey}`;

    return config;
  },

  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const newAccessToken = await getValidAccessToken().catch(() => null);

      if (newAccessToken) {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      }
      await tokenActions.removeTokens();
      await AsyncStorage.removeItem(USER_INFO_KEY);
      // return Promise.reject(error);
    }

    return Promise.reject(error);
  },
);

// import { tokenActions } from '@/helpers/auth';
// import axios from 'axios';
// import { getValidToken } from './helpers/interceptor';

// const baseURL = `${process.env.EXPO_PUBLIC_API_URL}/rest/v1/`;
// const apikey = process.env.EXPO_PUBLIC_API_KEY;

// export const axiosInstance = axios.create({
//   baseURL,
//   headers: {
//     apikey,
//     Authorization: `Bearer ${apikey}`,
//   },
// });

// axiosInstance.interceptors.request.use(
//   async (config) => {
//     const token = await getValidToken();
//     config.headers.Authorization = `Bearer ${token}`;
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   },
// );

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       await tokenActions.removeTokens();

//       return Promise.reject(error);
//     }
//     return Promise.reject(error);
//   },
// );
