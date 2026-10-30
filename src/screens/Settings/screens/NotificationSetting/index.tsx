import { Text } from '@/components/AppText';
import { VStack } from '@/components/ui/vstack';
import {
  DEFAULT_NOTIFICATION_SETTINGS,
  ensureAndroidChannel,
  getNotificationSettings,
  NotificationSettings,
  saveNotificationSettings,
} from '@/helpers/notification';
import { useEffect, useState } from 'react';
import { Platform, View } from 'react-native';
import CustomSwitch from './components/CustomSwitch';

type SettingRow = {
  key: keyof NotificationSettings;
  title: string;
  subtitle: string;
  androidOnly?: boolean;
};

const SETTING_ROWS: SettingRow[] = [
  {
    key: 'show_notifications',
    title: 'Show notifications',
    subtitle: 'Receive push notifications for new messages',
  },
  {
    key: 'notification_sounds',
    title: 'Notification sounds',
    subtitle: 'Play sound for new messages',
  },
  {
    key: 'lock_screen',
    title: 'Lock screen notifications',
    subtitle: 'Allow notification on the lock screen',
    androidOnly: true, // iOS'ta bu ayar sadece sistem ayarlarından yönetilir
  },
];

const NotificationSetting = () => {
  const [settings, setSettings] = useState<NotificationSettings>(
    DEFAULT_NOTIFICATION_SETTINGS,
  );

  useEffect(() => {
    getNotificationSettings().then(setSettings);
  }, []);

  const handleToggleSwitch = async (key: keyof NotificationSettings) => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);

    try {
      await saveNotificationSettings(updated);
      await ensureAndroidChannel(updated);
    } catch (error) {
      console.error(
        'AN ERROR OCCURED WHILE SAVING NOTIFICATION SETTINGS',
        error,
      );
    }
  };

  return (
    <VStack space="3xl" className="container mt-7 pt-28">
      {SETTING_ROWS.filter(
        (row) => !row.androidOnly || Platform.OS === 'android',
      ).map((row) => (
        <View
          key={`notification-setting-${row.key}`}
          className="flex-row items-center justify-between"
        >
          <View>
            <Text className="text-xl">{row.title}</Text>
            <Text className="text-sm text-gray-500">{row.subtitle}</Text>
          </View>
          <CustomSwitch
            value={settings[row.key]}
            onValueChange={() => handleToggleSwitch(row.key)}
            disabled={false}
          />
        </View>
      ))}
    </VStack>
  );
};

export default NotificationSetting;
