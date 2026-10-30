import { useEffect, useRef } from 'react';
import { Animated, Pressable } from 'react-native';

interface Props {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled: boolean;
}

const CustomSwitch = ({ value, onValueChange, disabled = false }: Props) => {
  const translateX = useRef(new Animated.Value(value ? 24 : 0));

  useEffect(() => {
    Animated.timing(translateX.current, {
      toValue: value ? 20 : 2,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [value, translateX]);
  return (
    <Pressable
      onPress={() => {
        if (!disabled && onValueChange) {
          onValueChange(!value);
        }
      }}
      className={`w-14 h-8 rounded-full justify-center px-1 transition-colors duration-200 ${
        disabled ? 'opacity-50' : 'opacity-100'
      } ${value ? 'bg-sage' : 'bg-muted'}`}
    >
      <Animated.View
        style={{ transform: [{ translateX: translateX.current }] }}
        className="w-6 h-6 bg-white rounded-full shadow-sm"
      ></Animated.View>
    </Pressable>
  );
};

export default CustomSwitch;
