// import { AccountNav } from '@/types/account';
// import Entypo from '@expo/vector-icons/Entypo';
// import { Pressable, Text, View } from 'react-native';

// interface Props {
//   nav: AccountNav;
//   className: string;
// }

// const SingleAccounNavtItem = ({ nav, className }: Props) => (
//   <Pressable
//     className={`flex-row items-center justify-between py-7 border-gray-300 ${className}`}
//     {...(nav.action && { onPress: nav.action })}
//   >
//     <View className="flex-row items-center gap-4">
//       {nav.icon}
//       <Text className="text-lg">{nav.label}</Text>
//     </View>
//     {!nav.action && (
//       <View>
//         <Entypo name={'chevron-small-right'} size={30} color="black" />
//       </View>
//     )}
//   </Pressable>
// );

// export default SingleAccounNavtItem;
