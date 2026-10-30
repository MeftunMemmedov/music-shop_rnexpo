import { View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import CategoryAccordionList from './components/CategoryAccordionList';
import SearchBtn from './components/SearchBtn';

const Discover = () => {
  return (
    <View className="container flex-1">
      <SearchBtn />
      <ScrollView
        className="flex-1"
        contentContainerClassName="pt-7 pb-20"
        showsVerticalScrollIndicator={false}
      >
        <CategoryAccordionList />
      </ScrollView>
    </View>
  );
};

export default Discover;
