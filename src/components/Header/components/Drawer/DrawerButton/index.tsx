import { colors } from '@/constants/style';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';
import { Pressable } from 'react-native';
const DrawerButton = () => {
  const navigation = useNavigation();
  return (
    <Pressable
      onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
    >
      <MaterialIcons name="notes" size={30} color={colors.charcoal} />
    </Pressable>
  );
};

export default DrawerButton;
