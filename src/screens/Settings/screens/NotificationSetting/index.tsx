import { Text } from '@/components/AppText';
import { VStack } from '@/components/ui/vstack';
import { NOTIFICATIONS_SETTINGS_KEY } from '@/constants/storagekeys';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  AndroidImportance,
  AndroidNotificationVisibility,
  setNotificationChannelAsync,
  setNotificationHandler,
} from 'expo-notifications';
import { useEffect, useState } from 'react';
import { Platform, View } from 'react-native';
import CustomSwitch from './components/CustomSwitch';

type NotificationSetting = {
  key: string;
  title: string;
  subtitle: string;
  value: boolean;
};

const NotificationSetting = () => {
  const [notificationSettings, setNotificationSetting] = useState<
    NotificationSetting[]
  >([
    {
      key: 'show_notifications',
      title: 'Show notifications',
      subtitle: 'Receive push notifications for new messages',
      value: true,
    },
    {
      key: 'notification_sounds',
      title: 'Notification sounds',
      subtitle: 'Play sound for new messages',
      value: false,
    },
    {
      key: 'lock_screen',
      title: 'Lock screen notifications',
      subtitle: 'Allow notification on the lock screen',
      value: false,
    },
  ]);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await AsyncStorage.getItem(
          NOTIFICATIONS_SETTINGS_KEY,
        );
        if (savedSettings) {
          const parsed = JSON.parse(savedSettings);

          setNotificationSetting((prev) =>
            prev.map((item) => ({
              ...item,
              value:
                parsed[item.key] !== undefined ? parsed[item.key] : item.value,
            })),
          );
          applyNotificationBehavior(parsed);
        }
      } catch (error) {
        console.error(
          'AN ERROR OCCURED WHILE LOADING NOTIFCATIONS SETTIGNS',
          error,
        );
      }
    };

    loadSettings();
  }, []);

  const handleToggleSwitch = async (key: string, currentValue: boolean) => {
    const newValue = !currentValue;

    const updatedSettings = notificationSettings.map((setting) =>
      setting.key === key ? { ...setting, value: newValue } : setting,
    );
    setNotificationSetting(updatedSettings);

    const settingsObject = updatedSettings.reduce(
      (acc, curr) => {
        acc[curr.key] = curr.value;
        return acc;
      },
      {} as Record<string, boolean>,
    );

    try {
      await AsyncStorage.setItem(
        NOTIFICATIONS_SETTINGS_KEY,
        JSON.stringify(settingsObject),
      );
      applyNotificationBehavior(settingsObject);
    } catch (error) {}
  };

  const applyNotificationBehavior = async (
    settingsObject: Record<string, boolean>,
  ) => {
    const showNotifications = settingsObject['show_notifications'] ?? true;
    const playSound = settingsObject['notification_sounds'] ?? false;
    const showOnLockScreen = settingsObject['lock_screen'] ?? false;

    setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: showNotifications, // Expo'nun standart beklediği değer budur
        shouldShowList: showNotifications,
        shouldShowBanner: showNotifications,
        shouldPlaySound: playSound,
        shouldSetBadge: showNotifications,
      }),
    });

    if (Platform.OS === 'android') {
      await setNotificationChannelAsync('default', {
        name: 'Default',
        importance: AndroidImportance.MAX,
        lockscreenVisibility: showOnLockScreen
          ? AndroidNotificationVisibility.PUBLIC
          : AndroidNotificationVisibility.SECRET,
      });
    }
  };

  return (
    <VStack space="3xl" className="container mt-7 pt-28">
      {notificationSettings.map((notificSetting) => (
        <View
          key={`notification-setting-${notificSetting.title}`}
          className="flex-row items-center justify-between"
        >
          <View>
            <Text className="text-xl">{notificSetting.title}</Text>
            <Text className="text-sm text-gray-500">
              {notificSetting.subtitle}
            </Text>
          </View>
          <CustomSwitch
            value={notificSetting.value}
            onValueChange={() =>
              handleToggleSwitch(notificSetting.key, notificSetting.value)
            }
            disabled={false}
          />
        </View>
      ))}
    </VStack>
  );
};

export default NotificationSetting;
