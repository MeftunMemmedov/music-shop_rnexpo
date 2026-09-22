import {
  Drawer,
  DrawerBackdrop,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from '@/components/ui/drawer';
import { colors, styles } from '@/constants/style';
import { useResponsive } from '@/hooks';
import { ProductFilterParams } from '@/types';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Keyboard, Platform, Pressable, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Text } from '../AppText';
import { Accordion } from '../ui/accordion';
import { Divider } from '../ui/divider';
import * as Filters from './components/Filter';

interface Props {
  btnClassName: string;
  withIcon: boolean;
  disabled: boolean;
  categoryFilterDisabled: boolean;
  searchParams: ProductFilterParams;
  isInProductsByCategoryScreen?: boolean;
}

const FilterModal = ({
  btnClassName,
  withIcon,
  disabled,
  categoryFilterDisabled,
  searchParams,
  isInProductsByCategoryScreen,
}: Props) => {
  const router = useRouter();
  const { isTablet } = useResponsive();

  const [, setKeyboardHeight] = useState<number>(0);

  useEffect(() => {
    const showEvent =
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent =
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [filterParams, setFilterParams] =
    useState<Record<string, string | string[] | undefined>>(searchParams);

  const { slug } = searchParams;

  const hasDefaultFilterParams =
    filterParams?.brandQuery ||
    filterParams?.priceQuery_gte ||
    filterParams?.priceQuery_lte;

  const handleOpenModal = () => {
    setFilterParams(searchParams);
    setIsModalOpen(true);
  };

  const applyFilters = () => {
    router.setParams(filterParams);
    setIsModalOpen(false);
  };

  const resetFilters = () => {
    const resetValues = {
      ...(isInProductsByCategoryScreen && { slug }),
      categoryQuery: isInProductsByCategoryScreen ? slug : undefined,
      brandQuery: undefined,
      priceQuery_lte: undefined,
      priceQuery_gte: undefined,
    };
    setFilterParams(resetValues);

    router.setParams(resetValues);

    setIsModalOpen(false);
  };

  return (
    <>
      <Pressable
        disabled={disabled}
        onPress={handleOpenModal}
        className={btnClassName}
        style={disabled ? styles.shadow_disabled : styles.shadow}
      >
        {withIcon ? (
          <MaterialCommunityIcons
            name="tune-variant"
            size={28}
            color={disabled ? '#d5d9e6' : colors['slate-gray']}
            className="m-auto"
          />
        ) : (
          <View className="w-full h-full">
            <Text
              aria-disabled={disabled}
              className="font-semibold aria-disabled:text-[#d5d9e6] text-slate-gray m-auto"
            >
              Filter
            </Text>
          </View>
        )}
      </Pressable>

      <Drawer
        anchor="right"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        size={isTablet ? 'md' : 'lg'}
      >
        <DrawerBackdrop />
        <DrawerContent className="rounded-l-3xl">
          <DrawerHeader>
            <View className="flex-row items-center justify-between w-full pt-5">
              <Text className="text-2xl text-charcoal font-medium">Filter</Text>
              <DrawerCloseButton>
                <EvilIcons name="close" size={24} color={colors.charcoal} />
              </DrawerCloseButton>
            </View>
          </DrawerHeader>
          <Divider className="mt-6 mb-3" />
          <KeyboardAwareScrollView
            style={{ flex: 1 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            enableOnAndroid={true}
            extraScrollHeight={60}
          >
            <DrawerBody>
              <Accordion
                type="multiple"
                defaultValue={
                  isInProductsByCategoryScreen
                    ? ['Category', filterParams.brandQuery ? 'Brands' : '']
                    : [
                        filterParams.brandQuery ? 'Brands' : '',
                        filterParams.categoryQuery ? 'Category' : '',
                      ]
                }
              >
                {!categoryFilterDisabled && (
                  <Filters.CategoryFilter
                    isInProductsByCategoryScreen={isInProductsByCategoryScreen}
                    categoryQuery={filterParams.categoryQuery}
                    categorySlug={slug}
                    onChange={(newQuery) => {
                      setFilterParams((fParams) => ({
                        ...fParams,
                        categoryQuery: newQuery!,
                      }));
                    }}
                  />
                )}
                <Filters.BrandFilter
                  brandQuery={filterParams.brandQuery}
                  onChange={(newQuery) => {
                    setFilterParams((fParams) => ({
                      ...fParams,
                      brandQuery: newQuery!,
                    }));
                  }}
                />
                <Filters.PriceFilter
                  priceQuery_lte={filterParams.priceQuery_lte}
                  priceQuery_gte={filterParams.priceQuery_gte}
                  onChange={(newParams) => {
                    setFilterParams((fParams) => ({
                      ...fParams,
                      ...newParams,
                    }));
                  }}
                />
              </Accordion>
            </DrawerBody>
          </KeyboardAwareScrollView>
          <DrawerFooter>
            <View className="w-full pb-5 flex-row items-center gap-3">
              {(isInProductsByCategoryScreen &&
                slug !== filterParams.categoryQuery) ||
              hasDefaultFilterParams ||
              (!isInProductsByCategoryScreen && filterParams.categoryQuery) ||
              hasDefaultFilterParams ? (
                <Pressable
                  className="rounded-full px-10 py-3 border border-charcoal"
                  onPress={resetFilters}
                >
                  <Text className="text-charcoal">Reset</Text>
                </Pressable>
              ) : null}
              <Pressable
                className="rounded-full px-10 py-3 border bg-charcoal disabled:bg-gray-600"
                onPress={applyFilters}
              >
                <Text className="text-white">Apply</Text>
              </Pressable>
            </View>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default FilterModal;
