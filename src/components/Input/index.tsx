import { FormControl } from '@/components/ui/form-control';
import { Input, InputField } from '@/components/ui/input';
import AntDesign from '@expo/vector-icons/AntDesign';
import { IInputFieldProps } from '@gluestack-ui/core/lib/esm/input/creator/types';
import {
  Dispatch,
  Ref,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  Pressable,
  ReturnKeyTypeOptions,
  SubmitBehavior,
  TextInput,
  TextInputProps,
  TextInputSubmitEditingEvent,
  View,
} from 'react-native';
import { Text } from '../AppText';
import InputError from '../InputError';

interface Props extends IInputFieldProps {
  label: string;
  value: string;
  disabled: boolean;
  inputRef: Ref<TextInput>;
  onChangeText: (text: string) => void;
  errorMessage?: string;
  className?: string;
  isInvalid?: boolean;
  isRequired?: boolean;
  submitBehavior?: SubmitBehavior;
  returnKeyType?: ReturnKeyTypeOptions | undefined;
  onSubmitEditing?: (e: TextInputSubmitEditingEvent) => void;
  setFocused?: Dispatch<SetStateAction<boolean>>;
}

const FloatingLabelInput = ({
  label,
  value,
  disabled,
  inputRef,
  onChangeText,
  errorMessage,
  className,
  isInvalid = false,
  isRequired = false,
  submitBehavior,
  returnKeyType = 'done',
  onSubmitEditing,
  setFocused,
  ...props
}: Props) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const animatedValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: isFocused || value ? 1 : 0,
      duration: 180,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const labelStyle = {
    top: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [12, -12],
    }),
    fontSize: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
  };

  const isPasswordInput = label.includes('password');

  return (
    <FormControl isInvalid={isInvalid} className={`w-full mt-2 ${className}`}>
      <View className="relative w-full">
        <Animated.Text
          style={labelStyle}
          pointerEvents="none"
          className={`absolute left-3 z-10 font-medium transition-colors ${
            isInvalid
              ? 'text-red-500'
              : isFocused
                ? 'text-gray-500'
                : value
                  ? 'text-gray-600'
                  : 'text-gray-400'
          }`}
        >
          {label}{' '}
          {isRequired && <Text className="text-red-500 ml-2 text-lg">*</Text>}
        </Animated.Text>

        <Input
          {...props}
          isDisabled={disabled}
          variant="underlined"
          className="h-12"
        >
          <InputField
            {...props}
            value={value}
            keyboardType={label.includes('Phone') ? 'numeric' : 'default'}
            className={`text-black pt-1.5 px-3 font-semibold ${isPasswordInput ? 'pr-12 pl-3' : 'px-3'}`}
            returnKeyType={returnKeyType}
            ref={inputRef as Ref<TextInputProps>}
            secureTextEntry={isPasswordInput && !isPasswordVisible}
            onChangeText={onChangeText}
            onSubmitEditing={onSubmitEditing}
            submitBehavior={submitBehavior}
            onFocus={() => {
              setIsFocused(true);
              if (setFocused) {
                setFocused(true);
              }
            }}
            onBlur={() => {
              setIsFocused(false);
              if (setFocused) {
                setFocused(false);
              }
            }}
          />
        </Input>
        {isPasswordInput && (
          <Pressable
            focusable={false}
            className="absolute right-4 z-20 bottom-2"
            onPress={() => {
              setIsPasswordVisible((prevState) => !prevState);
            }}
          >
            <AntDesign
              name={isPasswordVisible ? 'eye' : 'eye-invisible'}
              size={24}
              color="black"
            />
          </Pressable>
        )}
      </View>

      {isInvalid && errorMessage && <InputError errorMessage={errorMessage} />}
    </FormControl>
  );
};

export default FloatingLabelInput;
