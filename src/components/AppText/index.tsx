import { Text as AppText, TextProps } from 'react-native';

export const Text = ({ children, className = '', ...props }: TextProps) => {
  return (
    <AppText className={`font-sans leading-tight ${className}`} {...props}>
      {children}
    </AppText>
  );
};
