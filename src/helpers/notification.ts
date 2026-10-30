import { NOTIFICATIONS_SETTINGS_KEY } from '@/constants/storagekeys';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AndroidImportance,
  AndroidNotificationVisibility,
  setNotificationChannelAsync,
} from 'expo-notifications';
import { Platform } from 'react-native';

export type NotificationSettings = {
  show_notifications: boolean;
  notification_sounds: boolean;
  lock_screen: boolean;
};

export const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  show_notifications: true,
  notification_sounds: false,
  lock_screen: false,
};

export const getNotificationSettings =
  async (): Promise<NotificationSettings> => {
    try {
      const saved = await AsyncStorage.getItem(NOTIFICATIONS_SETTINGS_KEY);
      if (!saved) return DEFAULT_NOTIFICATION_SETTINGS;
      return { ...DEFAULT_NOTIFICATION_SETTINGS, ...JSON.parse(saved) };
    } catch (error) {
      console.error(
        'AN ERROR OCCURED WHILE GETTING NOTIFICATION SETTINGS',
        error,
      );
      return DEFAULT_NOTIFICATION_SETTINGS;
    }
  };

export const saveNotificationSettings = async (
  settings: NotificationSettings,
) => {
  await AsyncStorage.setItem(
    NOTIFICATIONS_SETTINGS_KEY,
    JSON.stringify(settings),
  );
};

export const getAndroidChannelId = (settings: NotificationSettings) =>
  `general-${settings.notification_sounds ? 'sound' : 'silent'}-${
    settings.lock_screen ? 'public' : 'private'
  }`;

export const ensureAndroidChannel = async (
  settings: NotificationSettings,
): Promise<string | undefined> => {
  if (Platform.OS !== 'android') return undefined;

  const channelId = getAndroidChannelId(settings);

  await setNotificationChannelAsync(channelId, {
    name: `General (${settings.notification_sounds ? 'sound' : 'silent'}, lock screen ${
      settings.lock_screen ? 'visible' : 'hidden'
    })`,
    importance: AndroidImportance.MAX,
    sound: settings.notification_sounds ? 'default' : null,
    lockscreenVisibility: settings.lock_screen
      ? AndroidNotificationVisibility.PUBLIC
      : AndroidNotificationVisibility.PRIVATE,
  });

  return channelId;
};
