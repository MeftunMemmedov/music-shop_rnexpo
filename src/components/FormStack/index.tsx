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
              const fieldName = formField.name;
              if (
                fieldName === 'user_name' ||
                formField.name === 'data.user_name'
              ) {
                const filteredText = text.replace(
                  /[^a-zA-ZğüşıöçĞÜŞİÖÇ\s]/g,
                  '',
                );
                onChange(filteredText);
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
