import TanstackQueryProvider from '@/providers/TanstackQueryProvider';
import ReduxProvider from '@/store/provider';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { ReactNode } from 'react';
import { GluestackUIProvider } from '../ui/gluestack-ui-provider';

const CustomTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: '#FFFFFF',
  },
};

const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <ReduxProvider>
        <TanstackQueryProvider>
          <GluestackUIProvider mode="light">
            <ThemeProvider value={CustomTheme}>{children}</ThemeProvider>
          </GluestackUIProvider>
        </TanstackQueryProvider>
      </ReduxProvider>
    </>
  );
};

export default Providers;
