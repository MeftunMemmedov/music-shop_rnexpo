import { Text } from 'moti';
import { ComponentProps } from 'react';

type AnimatedTextProps = ComponentProps<typeof Text>;

export const AnimatedText = ({
  className = '',
  children,
  ...props
}: AnimatedTextProps) => {
  return (
    <Text className={`font-sans ${className}`} {...props}>
      {children}
    </Text>
  );
};
