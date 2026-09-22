import DrawerContent from '@/components/Header/components/Drawer/DrawerContent';
import InitialDataDIspatcher from '@/providers/InitialDataDispatcher';
import NotificationProvider from '@/providers/NotificationProvider';

import { Drawer } from 'expo-router/drawer';

const DrawerLayout = () => {
  return (
    <NotificationProvider>
      <InitialDataDIspatcher>
        <Drawer
          screenOptions={{ headerShown: false }}
          drawerContent={() => <DrawerContent />}
        ></Drawer>
      </InitialDataDIspatcher>
    </NotificationProvider>
  );
};

export default DrawerLayout;
