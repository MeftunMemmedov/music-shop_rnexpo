import { Input, InputField, InputIcon, InputSlot } from '@/components/ui/input';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Dispatch, SetStateAction } from 'react';
import { View } from 'react-native';

import FilterModal from '@/components/FilterModal';
import { colors, styles } from '@/constants/style';
import { ProductFilterParams } from '@/types';
import Feather from '@expo/vector-icons/Feather';

const SearchIcon = () => (
  <Feather name="search" size={24} color={colors['slate-gray']} />
);

const DeleteIcon = () => (
  <Ionicons name="close-circle" size={24} color={colors['slate-gray']} />
);

interface Props {
  searchInput: string;
  isSearchInputEmpty: boolean;
  searchParams: ProductFilterParams;
  disabled: boolean;
  setSearchInput: Dispatch<SetStateAction<string>>;
  isInputDisabled: boolean;
}

const SearchInput = ({
  searchInput,
  isSearchInputEmpty,
  searchParams,
  disabled,
  setSearchInput,
  isInputDisabled,
}: Props) => {
  return (
    <>
      <View className="flex-row justify-between mt-5">
        <Input
          variant="rounded"
          isDisabled={isInputDisabled}
          style={styles.shadow}
          className="h-[59px] bg-zinc-50 w-[78%] pl-7 pr-4 border-0"
        >
          {isSearchInputEmpty && (
            <InputSlot>
              <InputIcon as={SearchIcon} />
            </InputSlot>
          )}

          <InputField
            value={searchInput}
            onChangeText={(text) => setSearchInput(text)}
            placeholder={isInputDisabled ? 'Check your connection' : 'Search'}
            className={
              isSearchInputEmpty
                ? 'placeholder:text-slate-gray placeholder:font-medium placeholder:mt-2'
                : undefined
            }
          />
          {!isSearchInputEmpty && (
            <InputSlot onPress={() => setSearchInput('')}>
              <InputIcon as={DeleteIcon} />
            </InputSlot>
          )}
        </Input>
        <FilterModal
          disabled={disabled}
          searchParams={searchParams}
          categoryFilterDisabled={false}
          withIcon
          btnClassName="aspect-[51/49] bg-zinc-50 rounded-3xl"
        />
      </View>
      {/* <Text>Category {searchParams.categoryQuery}</Text>
      <Text>Brands {searchParams.brandQuery}</Text> */}
      {/* {!isSearchInputEmpty && (
        <View className="mt-4">
          <Link href={'/'} className="m-auto">
            <Text className="font-semibold">All results for {searchInput}</Text>
          </Link>
        </View>
      )} */}
    </>
  );
};

export default SearchInput;
