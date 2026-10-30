import DrawerContent from '@/components/Header/components/Drawer/DrawerContent';
import InitialDataDIspatcher from '@/providers/InitialDataDispatcher';

import { Drawer } from 'expo-router/drawer';

const DrawerLayout = () => {
  return (
    <InitialDataDIspatcher>
      <Drawer
        screenOptions={{ headerShown: false }}
        drawerContent={() => <DrawerContent />}
      ></Drawer>
    </InitialDataDIspatcher>
  );
};

export default DrawerLayout;
