import Feather from '@expo/vector-icons/Feather';
import React from 'react';
import {
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
} from '../ui/form-control';

const ErrorIcon = () => <Feather name="alert-circle" size={20} color="red" />;

const InputError = ({ errorMessage }: { errorMessage?: string }) => {
  if (!errorMessage) return null;
  return (
    <FormControlError className="mt-1">
      <FormControlErrorIcon as={ErrorIcon} />
      <FormControlErrorText className="text-red-500 text-xs ml-1">
        {errorMessage}
      </FormControlErrorText>
    </FormControlError>
  );
};

export default InputError;
