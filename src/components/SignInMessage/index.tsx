import { Link } from 'expo-router';
import { motify } from 'moti';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import { Text } from '../AppText';

interface Props {
  onPress?: () => void;
  message?: string;
}

const SignInMessage = ({
  onPress,
  message = 'Please sign in to see your account and details',
}: Props) => {
  const [isPressed, setIsPressed] = useState<boolean>(false);

  const MotiLink = motify(Link)();

  return (
    <View className="flex-col w-11/12 m-auto">
      <Text className="text-center mb-3">
        You havent signed in yet. {message}
      </Text>
      <MotiLink
        href="/auth/signin"
        className="w-32 bg-charcoal py-3 rounded-md mx-auto"
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        animate={{
          scale: isPressed ? 1.1 : 1,
        }}
        asChild={!!onPress}
      >
        {onPress ? (
          <Pressable onPress={onPress}>
            <Text className="text-white text-center">Sign In</Text>
          </Pressable>
        ) : (
          <Text className="text-white text-center">Sign In</Text>
        )}
      </MotiLink>
    </View>
  );
};

export default SignInMessage;
