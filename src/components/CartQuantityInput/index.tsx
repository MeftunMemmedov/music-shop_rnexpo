import { formatNumericInput } from '@/helpers/common';
import { Dispatch, SetStateAction, useState } from 'react';
import { View } from 'react-native';
import { Text } from '../AppText';
import { MotiPressable } from '../Motified';
import { Input, InputField } from '../ui/input';

interface Props {
  value: string;
  inputValueClassName: string;
  parentClassName: string;
  btnClassName: string;
  setQuantityInput: Dispatch<SetStateAction<string>>;
  btnSignClassName?: string;
  autoFocus?: boolean;
  disabled?: boolean;
  btnsDisabled?: boolean;
  updateQuantity?: (newQuantity: number) => void;
}

const CartQuantityInput = ({
  value,
  inputValueClassName,
  parentClassName,
  btnClassName,
  setQuantityInput,
  btnSignClassName,
  autoFocus = false,
  disabled = false,
  btnsDisabled,
  updateQuantity,
}: Props) => {
  const [isPlusPressed, setIsPlusPressed] = useState<boolean>(false);

  const [isMinusPressed, setIsMinusPressed] = useState<boolean>(false);

  const updateQuantityByClick = (type: '+' | '-') => {
    const quantityValue = value.trim() === '' ? 0 : parseInt(value.trim());
    if (type === '-' && quantityValue <= 1) return;
    const newQuantity = type === '+' ? quantityValue + 1 : quantityValue - 1;
    setQuantityInput(String(newQuantity));
    if (disabled && updateQuantity) {
      updateQuantity(newQuantity);
    }
  };

  return (
    <View
      className={`border rounded-full aspect-[64/22] px-1 ${parentClassName}`}
    >
      <View className="rounded-full w-full h-full my-auto flex-row justify-between items-center">
        <MotiPressable
          disabled={btnsDisabled}
          onPressIn={() => setIsMinusPressed(true)}
          onPressOut={() => setIsMinusPressed(false)}
          animate={{ scale: isMinusPressed ? 0.8 : 1 }}
          onPress={() => updateQuantityByClick('-')}
          className={`rounded-full w-[30%] aspect-square flex-row items-center justify-center ${btnClassName}`}
        >
          <Text className={btnSignClassName}>-</Text>
        </MotiPressable>

        <Input isDisabled={disabled} className="w-2/5 border-0">
          <InputField
            keyboardType="numeric"
            editable={!disabled}
            value={value}
            className={`text-center ${inputValueClassName}`}
            autoFocus={autoFocus}
            onChangeText={(text) => {
              const quantity = formatNumericInput(text);
              setQuantityInput(quantity);
            }}
          />
        </Input>

        <MotiPressable
          disabled={btnsDisabled}
          onPressIn={() => setIsPlusPressed(true)}
          onPressOut={() => setIsPlusPressed(false)}
          animate={{ scale: isPlusPressed ? 0.8 : 1 }}
          onPress={() => updateQuantityByClick('+')}
          className={`rounded-full w-[30%] aspect-square flex-row items-center justify-center ${btnClassName}`}
        >
          <Text className={btnSignClassName}>+</Text>
        </MotiPressable>
      </View>
    </View>
  );
};

export default CartQuantityInput;
