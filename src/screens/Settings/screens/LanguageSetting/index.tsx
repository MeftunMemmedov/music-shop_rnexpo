import { Text } from '@/components/AppText';
import { Divider } from '@/components/ui/divider';
import { VStack } from '@/components/ui/vstack';
import i18n from '@/i18n';
import { router } from 'expo-router';
import { Fragment } from 'react';
import { Pressable } from 'react-native';

const LanguageSetting = () => {
  const languages = [
    {
      label: 'Azerbaijan',
      value: 'az',
    },
    {
      label: 'English',
      value: 'en',
    },
  ];

  const isCurrentLang = (val: string) => i18n.language === val;
  return (
    <VStack className="container pt-28">
      {languages.map((lang) => (
        <Fragment key={`lang-${lang.value}`}>
          <Pressable
            disabled={isCurrentLang(lang.value)}
            onPress={() => {
              i18n.changeLanguage(lang.value);
              router.back();
            }}
            key={`lang-${lang.value}`}
            className="py-7"
          >
            <Text
              className={`ml-5 text-xl ${isCurrentLang(lang.value) ? 'font-semibold' : ''}`}
            >
              {lang.label}
            </Text>
          </Pressable>
          <Divider />
        </Fragment>
      ))}
    </VStack>
  );
};

export default LanguageSetting;
