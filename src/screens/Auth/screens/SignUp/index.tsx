import FormStack from '@/components/FormStack';
import { RegisterInput, registerSchema } from '@/schemas/register.schema';
import { FormFields } from '@/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import AuthLayout from '../../components/AuthLayout';

const SignUp = () => {
  const { control, handleSubmit } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      data: {
        user_name: '',
      },
    },
  });

  const formFields: FormFields<RegisterInput> = [
    {
      label: 'User name',
      name: 'data.user_name',
      required: true,
    },
    {
      label: 'Enter your email',
      name: 'email',
      required: true,
    },
    {
      label: 'Enter your password',
      name: 'password',
      required: true,
    },
    {
      label: 'Confirm your password',
      name: 'confirmPassword',
      required: true,
    },
  ];

  const onSubmit = handleSubmit((data: RegisterInput) => {
    console.log(data);
  });
  return (
    <AuthLayout
      title="Create your account"
      submitBtnTitle="SIGN UP"
      onSubmit={onSubmit}
      question="Already have account"
      authLink="/auth/signin"
      linkText="Sign In"
    >
      <FormStack fields={formFields} control={control} />
    </AuthLayout>
  );
};

export default SignUp;
