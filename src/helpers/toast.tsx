import { Text } from '@/components/AppText';
import { Toast, ToastDescription, ToastTitle } from '@/components/ui/toast';
import { ToastContent } from '@/types';
import { InterfaceToastProps } from '@gluestack-ui/core/lib/esm/toast/creator/types';
import { Link } from 'expo-router';
import { Dimensions, Pressable, View } from 'react-native';

interface ToastProps extends InterfaceToastProps {
  action: 'error' | 'warning' | 'success' | 'info' | 'muted' | undefined;
  className?: string;
  withLink?: boolean;
}

export const ToastContentComponent = ({
  content,
  toastSettings,
}: {
  content: ToastContent;
  toastSettings: ToastProps;
}) => {
  return (
    <>
      <ToastTitle>
        {content.title
          ? content.title
          : toastSettings.action === 'success'
            ? 'Success!'
            : toastSettings.action === 'error'
              ? 'Error!'
              : undefined}
      </ToastTitle>
      <ToastDescription>{content.description}</ToastDescription>
    </>
  );
};

export const showToast = (
  toast: {
    show: (props: InterfaceToastProps) => string;
    close: (id: string) => void;
    closeAll: () => void;
    isActive: (id: string) => boolean;
  },
  content: ToastContent,
  toastSettings: ToastProps,
) => {
  const { width } = Dimensions.get('screen');

  toast.show({
    id: toastSettings.id,
    placement: toastSettings.placement ?? 'top',
    duration: toastSettings.duration ?? 3000,
    containerStyle: { width },
    render: ({ id }) => {
      const uniqueToastId = 'toast-' + id;

      return (
        <Toast
          nativeID={uniqueToastId}
          action={toastSettings.action}
          variant="solid"
          className={toastSettings.className}
        >
          {toastSettings.withLink ? (
            <View className="flex-row items-center">
              <View className="w-4/5">
                <ToastContentComponent
                  content={content}
                  toastSettings={toastSettings}
                />
              </View>
              <Link href={content.href ?? '/'} asChild>
                <Pressable onPress={() => toast.close(id)} className="ml-auto">
                  <Text className="text-white">See</Text>
                </Pressable>
              </Link>
            </View>
          ) : (
            <ToastContentComponent
              content={content}
              toastSettings={toastSettings}
            />
          )}
        </Toast>
      );
    },
  });
};
