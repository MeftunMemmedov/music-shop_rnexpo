import axios from 'axios';
import Constants from 'expo-constants';
import { isDevice } from 'expo-device';
import { getExpoPushTokenAsync } from 'expo-notifications';
import { axiosInstance } from '..';

export const postPushToken = async (user_id?: string) => {
  if (!isDevice) return;

  const projectId = Constants.expoConfig?.extra?.eas?.projectId;

  if (!projectId) {
    console.warn('EAS Project id has not been found while signin in');
    return;
  }

  const tokenData = await getExpoPushTokenAsync({
    projectId,
  });

  const push_token = tokenData.data;
  try {
    await axiosInstance.post(
      'shop_devices',
      { push_token, user_id },
      {
        params: {
          on_conflict: 'push_token',
        },
        headers: {
          Prefer: 'resolution=merge-duplicates',
        },
      },
    );
  } catch (error) {
    console.error(`AN ERROR OCCURED WHILE SENDING PUSHTOKEN`);
    throw error;
  }
};

export const triggerPushNotification = async (notoficationBody: {
  user_id: string;
  title: string;
  body: string;
  data: Record<string, string>;
}) => {
  const apiurl = process.env.EXPO_PUBLIC_API_URL;
  const apikey = process.env.EXPO_PUBLIC_API_KEY;

  const { user_id, title, body, data } = notoficationBody;
  try {
    await axios.post(
      `${apiurl}functions/v1/send-notification`,
      { user_id, title, body, data: data || {} },
      {
        headers: {
          apikey,
          Authorization: `Bearer ${apikey}`,
        },
      },
    );
  } catch (error) {
    console.error('AN ERROR OCCURED WHILE SENDING PUSH NOTIFICATION', error);
    throw error;
  }
};
