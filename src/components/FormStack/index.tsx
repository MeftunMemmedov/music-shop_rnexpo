import { FormFields } from '@/types';
import { Dispatch, SetStateAction, useEffect, useRef } from 'react';
import { Control, Controller, FieldValues } from 'react-hook-form';
import { Keyboard, TextInput } from 'react-native';
import FloatingLabelInput from '../Input';
import { VStack } from '../ui/vstack';

interface Props<T extends FieldValues> {
  fields: FormFields<T>;
  control: Control<T>;
  className?: string;
  disabled: boolean;
  setFocused?: Dispatch<SetStateAction<boolean>>;
  onSubmit: () => void;
}

const FormStack = <T extends FieldValues>({
  fields,
  control,
  className,
  disabled,
  setFocused,
  onSubmit,
}: Props<T>) => {
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const COUNTRY_CODE = '994';

  const formatPhoneNumber = (input: string): string => {
    const hasPlus = input.trim().startsWith('+');
    const digits = input.replace(/\D/g, '');

    if (digits.length === 0) return hasPlus ? '+' : '';

    const isInternational =
      hasPlus ||
      digits.startsWith(COUNTRY_CODE) ||
      COUNTRY_CODE.startsWith(digits);

    if (isInternational) {
      if (digits.length <= 3 && COUNTRY_CODE.startsWith(digits)) {
        return `+${digits}`;
      }

      const rest = (
        digits.startsWith(COUNTRY_CODE) ? digits.slice(3) : digits
      ).slice(0, 9);

      let out = '+994';
      if (rest.length > 0) out += ` (${rest.slice(0, 2)}`;
      if (rest.length > 2) out += `) ${rest.slice(2, 5)}`;
      if (rest.length > 5) out += `-${rest.slice(5, 7)}`;
      if (rest.length > 7) out += `-${rest.slice(7, 9)}`;
      return out;
    }

    const d = digits.slice(0, 10);
    let out = `(${d.slice(0, 3)}`;
    if (d.length > 3) out += `) ${d.slice(3, 6)}`;
    if (d.length > 6) out += `-${d.slice(6, 8)}`;
    if (d.length > 8) out += `-${d.slice(8, 10)}`;
    return out;
  };

  useEffect(() => {
    const keyboardHideListener = Keyboard.addListener('keyboardDidHide', () => {
      for (const input of inputRefs.current) {
        input?.blur();
      }
    });

    return () => {
      keyboardHideListener.remove();
    };
  }, []);
  return (
    <VStack space="3xl" className={className}>
      {fields.map((formField, index) => (
        <Controller
          key={`input-${String(formField.name)}`}
          control={control}
          name={formField.name}
          render={({ field: { onChange, value }, fieldState: { error } }) => {
            const isLastField = index === fields.length - 1;

            const handleChange = (text: string) => {
              const fieldName = String(formField.name);

              const isUserName =
                fieldName === 'user_name' ||
                formField.name === 'data.user_name';

              const isPhone = fieldName === 'phone';

              if (isUserName) {
                const filteredText = text.replace(
                  /[^a-zA-ZğüşıöçĞÜŞİÖÇ\s]/g,
                  '',
                );
                onChange(filteredText);
              } else if (isPhone) {
                onChange(formatPhoneNumber(text));
              } else {
                onChange(text);
              }
            };
            return (
              <FloatingLabelInput
                setFocused={setFocused ?? undefined}
                inputRef={(el) => {
                  inputRefs.current[index] = el;
                }}
                returnKeyType={isLastField ? 'send' : 'next'}
                label={formField.label}
                value={value as string}
                onChangeText={handleChange}
                isInvalid={!!error}
                isRequired={formField.required}
                isReadOnly={formField.readonly}
                errorMessage={error?.message}
                onSubmitEditing={() => {
                  if (!isLastField) {
                    inputRefs.current[index + 1]?.focus();
                  } else {
                    onSubmit();
                  }
                }}
                submitBehavior={isLastField ? 'blurAndSubmit' : 'submit'}
                disabled={disabled}
              />
            );
          }}
        />
      ))}
    </VStack>
  );
};

export default FormStack;
