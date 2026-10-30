import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from '@/components/ui/select';
import Entypo from '@expo/vector-icons/Entypo';

interface Props {
  isDisabled: boolean;
  onChange: (val: string) => void;
  className?: string;
}

const SortSelect = ({ isDisabled, onChange, className }: Props) => {
  const sortOptions = [
    {
      label: 'Sort: Default',
      value: '',
    },
    {
      label: 'Alphabetically A-Z',
      value: 'title.asc',
    },
    {
      label: 'Alphabetically Z-A',
      value: 'title.desc',
    },
    {
      label: 'Price: Low to High',
      value: 'final_price.asc',
    },
    {
      label: 'Price: High to Low',
      value: 'final_price.desc',
    },
  ];

  return (
    <Select
      className={`w-44 ${className}`}
      onValueChange={onChange}
      isDisabled={isDisabled}
      defaultValue=""
    >
      <SelectTrigger variant="rounded" size="sm">
        <SelectInput
          className="mx-auto text-gray-400"
          placeholder="Sort: Default"
        />
        <SelectIcon
          className="mr-3"
          as={() => (
            <Entypo name={'chevron-small-down'} size={24} color="black" />
          )}
        />
      </SelectTrigger>
      <SelectPortal>
        <SelectBackdrop />
        <SelectContent>
          <SelectDragIndicatorWrapper>
            <SelectDragIndicator />
          </SelectDragIndicatorWrapper>
          {sortOptions.map((option) => (
            <SelectItem
              key={`sort-${option.value}`}
              label={option.label}
              value={option.value}
              // isDisabled={true}
            />
          ))}
        </SelectContent>
      </SelectPortal>
    </Select>
  );
};

export default SortSelect;
