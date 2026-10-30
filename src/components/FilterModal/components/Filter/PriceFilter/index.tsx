import { Text } from '@/components/AppText';
import { Input, InputField } from '@/components/ui/input';
import { colors } from '@/constants/style';
import { formatNumericInput } from '@/helpers/common';
import { useResponsive } from '@/hooks';
import { useEffect, useRef, useState } from 'react';
import { Keyboard, View } from 'react-native';
import RangeSlider from 'react-native-fast-range-slider';

const MAX_LIMIT = 2000;
const MIN_LIMIT = 0;

interface Props {
  priceQuery_gte: string | string[] | undefined;
  priceQuery_lte: string | string[] | undefined;
  onChange: ({
    priceQuery_gte,
    priceQuery_lte,
  }: {
    priceQuery_gte?: string | string[];
    priceQuery_lte?: string | string[];
  }) => void;
}

const PriceFilter = ({ priceQuery_gte, priceQuery_lte, onChange }: Props) => {
  const { isTablet } = useResponsive();
  const getMinVal = () => {
    const val = Array.isArray(priceQuery_gte)
      ? priceQuery_gte[0]
      : priceQuery_gte;
    return val ? parseInt(val) : MIN_LIMIT;
  };

  const getMaxVal = () => {
    const val = Array.isArray(priceQuery_lte)
      ? priceQuery_lte[0]
      : priceQuery_lte;
    return val ? parseInt(val) : MAX_LIMIT;
  };

  const [sliderValues, setSliderValues] = useState<number[]>([
    getMinVal(),
    getMaxVal(),
  ]);
  const [inputMin, setInputMin] = useState<string>(String(getMinVal()));
  const [inputMax, setInputMax] = useState<string>(String(getMaxVal()));

  useEffect(() => {
    const currentMin = getMinVal();
    const currentMax = getMaxVal();

    setSliderValues([currentMin, currentMax]);
    setInputMin(String(currentMin));
    setInputMax(String(currentMax));
  }, [priceQuery_gte, priceQuery_lte]);

  const handleSliderChangeFinish = (newValues: number[]) => {
    onChange({
      priceQuery_gte: String(newValues[0]),
      priceQuery_lte: String(newValues[1]),
    });
  };

  const handleMinBlur = () => {
    let num = parseInt(inputMin);
    if (isNaN(num)) num = MIN_LIMIT;
    if (num < MIN_LIMIT) num = MIN_LIMIT;
    if (num > sliderValues[1]) num = sliderValues[1] - 1;

    setInputMin(String(num));

    onChange({ priceQuery_gte: String(num) });
  };

  const handleMaxBlur = () => {
    let num = parseInt(inputMax);
    if (isNaN(num)) num = MAX_LIMIT;

    if (num > MAX_LIMIT) num = MAX_LIMIT;
    if (num < sliderValues[0]) num = sliderValues[0] + 1;

    setInputMax(String(num));

    onChange({ priceQuery_lte: String(num) });
  };

  const minInputRef = useRef<any>(null);
  const maxInputRef = useRef<any>(null);

  useEffect(() => {
    const keyboardHideListener = Keyboard.addListener('keyboardDidHide', () => {
      minInputRef.current?.blur();
      maxInputRef.current?.blur();
    });

    return () => {
      keyboardHideListener.remove();
    };
  }, []);

  return (
    <View className="h-32 mt-4 px-4">
      <Text className="font-bold mb-2 text-charcoal">Price</Text>

      <RangeSlider
        key={`${sliderValues[0]}-${sliderValues[1]}`}
        initialMinValue={sliderValues[0]}
        initialMaxValue={sliderValues[1]}
        min={MIN_LIMIT}
        max={MAX_LIMIT}
        step={1}
        thumbSize={20}
        trackHeight={2.5}
        width={isTablet ? 450 : 200}
        selectedTrackStyle={{ backgroundColor: colors.charcoal }}
        unselectedTrackStyle={{ backgroundColor: '#CECECE' }}
        thumbStyle={{
          backgroundColor: 'white',
          borderWidth: 1,
          borderColor: colors.charcoal,
        }}
        pressedThumbStyle={{ transform: [{ scale: 1.2 }] }}
        enabled={true}
        allowOverlap={false}
        showThumbLines={false}
        minimumDistance={16}
        onValuesChangeFinish={handleSliderChangeFinish}
        leftThumbAccessibilityLabel="Minimum value"
        rightThumbAccessibilityLabel="Maximum value"
      />

      <View className="flex-row gap-5 justify-between items-center mt-4">
        <Input variant="underlined" className="w-24 pb-4">
          <InputField
            ref={minInputRef}
            placeholder="Min."
            keyboardType="numeric"
            value={inputMin}
            onChangeText={(text) => setInputMin(formatNumericInput(text))}
            onBlur={handleMinBlur}
            className="border-b"
          />
        </Input>

        <Input variant="underlined" className="w-24 pb-4">
          <InputField
            ref={maxInputRef}
            placeholder="Max."
            keyboardType="numeric"
            value={inputMax}
            onChangeText={(text) => setInputMax(formatNumericInput(text))}
            onBlur={handleMaxBlur}
            className="border-b"
          />
        </Input>
      </View>
    </View>
  );
};

export default PriceFilter;

// import { Input, InputField } from '@/components/ui/input';
// import { colors } from '@/constants/style';
// import { useRouter } from 'expo-router';
// import { useEffect, useState } from 'react';
// import { Text, View } from 'react-native';
// import RangeSlider from 'react-native-fast-range-slider';

// const MAX_LIMIT = 2000;
// const MIN_LIMIT = 0;

// const PriceFilter = ({
//   priceQuery_gte,
//   priceQuery_lte,
// }: {
//   priceQuery_gte: string | string[];
//   priceQuery_lte: string | string[];
// }) => {
//   const router = useRouter();

//   const [sliderValues, setSliderValues] = useState<number[]>([20, 380]);

//   const [inputMin, setInputMin] = useState<string>('20');
//   const [inputMax, setInputMax] = useState<string>('380');

//   const handleSliderChangeFinish = (newValues: number[]) => {
//     setSliderValues(newValues);
//     setInputMin(newValues[0].toString());
//     setInputMax(newValues[1].toString());

//     router.setParams({
//       priceQuery_gte: String(newValues[0]),
//       priceQuery_lte: String(newValues[1]),
//     });
//   };

//   const handleMinBlur = () => {
//     let num = parseInt(inputMin) || MIN_LIMIT;

//     if (num < MIN_LIMIT) num = MIN_LIMIT;
//     if (num > sliderValues[1]) num = sliderValues[1];

//     setInputMin(num.toString());
//     setSliderValues([num, sliderValues[1]]);
//     router.setParams({ priceQuery_gte: String(num) });
//     // console.log('Min:', [num, sliderValues[1]]);
//   };

//   const handleMaxBlur = () => {
//     let num = parseInt(inputMax) || MAX_LIMIT;

//     if (num > MAX_LIMIT) num = MAX_LIMIT;
//     if (num < sliderValues[0]) num = sliderValues[0];

//     setInputMax(num.toString());
//     setSliderValues([sliderValues[0], num]);
//     router.setParams({ priceQuery_lte: String(num) });
//     // console.log('Max:'[(sliderValues[0], num)]);
//   };

//   useEffect(()=>{

//   },[priceQuery_gte,priceQuery_lte])

//   return (
//     <View className="h-32 mt-4 px-4">
//       <Text className="font-bold mb-2 text-charcoal">Price</Text>

//       <RangeSlider
//         initialMinValue={sliderValues[0]}
//         initialMaxValue={sliderValues[1]}
//         min={MIN_LIMIT}
//         max={MAX_LIMIT}
//         step={1}
//         width={200}
//         thumbSize={20}
//         trackHeight={2.5}
//         selectedTrackStyle={{ backgroundColor: colors.charcoal }}
//         unselectedTrackStyle={{ backgroundColor: '#CECECE' }}
//         thumbStyle={{
//           backgroundColor: 'white',
//           borderWidth: 1,
//           borderColor: colors.charcoal,
//         }}
//         pressedThumbStyle={{ transform: [{ scale: 1.2 }] }}
//         enabled={true}
//         allowOverlap={false}
//         showThumbLines={false}
//         minimumDistance={16}
//         onValuesChangeFinish={handleSliderChangeFinish}
//         leftThumbAccessibilityLabel="Minimum value"
//         rightThumbAccessibilityLabel="Maximum value"
//       />

//       <View className="flex-row gap-5 justify-between items-center mt-4">
//         <Input variant="underlined" className="w-24">
//           <InputField
//             placeholder="Min."
//             keyboardType="numeric"
//             value={inputMin}
//             onChangeText={setInputMin}
//             onBlur={handleMinBlur}
//           />
//         </Input>

//         <Input variant="underlined" className="w-24">
//           <InputField
//             placeholder="Max."
//             keyboardType="numeric"
//             value={inputMax}
//             onChangeText={setInputMax}
//             onBlur={handleMaxBlur}
//           />
//         </Input>
//       </View>
//     </View>
//   );
// };

// export default PriceFilter;
