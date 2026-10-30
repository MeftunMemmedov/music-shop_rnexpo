import { AuthTokens } from '@/types';
import axios from 'axios';

export const authBaseURL = `${process.env.EXPO_PUBLIC_API_URL}/auth/v1/`;
const baseURL = authBaseURL;
const apikey = process.env.EXPO_PUBLIC_API_KEY;

export const authAxiosInstance = axios.create({
  baseURL,
  headers: {
    apikey,
    Authorization: `Bearer ${apikey}`,
  },
});

export const refreshAccess = async (
  refresh_token: string,
): Promise<AuthTokens> => {
  const { data } = await authAxiosInstance.post(
    'token?grant_type=refresh_token',
    { refresh_token },
  );

  return data;
};

// authAxiosInstance.interceptors.request.use(
//   async (config) => {
//     const access_token = await tokenActions.getToken('access');
//     const expires_in = await tokenActions.getToken('expires_in');
//     const now = Date.now();

//     const isExpired = expires_in
//       ? now >= parseInt(expires_in, 10) - 10000
//       : false;

//     if (access_token && !isExpired) {
//       config.headers.Authorization = `Bearer ${access_token}`;
//       return config;
//     }

//     if (access_token && isExpired) {
//       const refresh_token = await tokenActions.getToken('refresh');
//       if (refresh_token) {
//         try {
//           if (!refreshPromise) {
//             refreshPromise = refreshAccess(refresh_token)
//               .then(async (res) => {
//                 const { access_token, expires_in, refresh_token } = res;
//                 await tokenActions.saveTokens(
//                   access_token,
//                   expires_in,
//                   refresh_token,
//                 );

//                 return res;
//               })

//               .finally(() => {
//                 refreshPromise = null;
//               });
//           }
//           const new_access_token = (await refreshPromise).access_token;
//           config.headers.Authorization = `Bearer ${new_access_token}`;

//           return config;
//         } catch (error) {
//           await tokenActions.removeTokens();
//           config.headers.Authorization = `Bearer ${apikey}`;

//           return config;
//         }
//       } else {
//         await tokenActions.removeTokens();
//         config.headers.Authorization = `Bearer ${apikey}`;

//         return config;
//       }
//     }

//     config.headers.Authorization = `Bearer ${apikey}`;

//     return config;
//   },

//   (error) => {
//     return Promise.reject(error);
//   },
// );
