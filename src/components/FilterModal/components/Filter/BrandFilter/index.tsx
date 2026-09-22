import AccordionRow from '@/components/AccordionRow';
import { Text } from '@/components/AppText';
import { useBrands } from '@/hooks/query';
import { Pressable } from 'react-native';
import SelectedIcon from '../../../../Selected';

interface Props {
  brandQuery?: string | string[];
  onChange: (brandQuery?: string) => void;
}

const BrandFilter = ({ brandQuery, onChange }: Props) => {
  const { data: brands } = useBrands();

  const isBrandSelected = (slug: string) => brandQuery === slug;

  if (!brands || brands.length === 0) return null;
  return (
    <AccordionRow
      title="Brands"
      content={brands.map((brand) => (
        <Pressable
          key={`brand-${brand.id}`}
          className="mb-3 flex-row items-center"
          onPress={() => {
            onChange(isBrandSelected(brand.slug) ? undefined : brand.slug);
          }}
        >
          <SelectedIcon isSelected={isBrandSelected(brand.slug)} />
          <Text className={`${isBrandSelected(brand.slug) ? 'font-bold' : ''}`}>
            {brand.title}
          </Text>
        </Pressable>
      ))}
    />
  );
};

export default BrandFilter;
