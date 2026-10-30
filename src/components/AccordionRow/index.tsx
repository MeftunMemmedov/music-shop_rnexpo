import {
  AccordionContent,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionTitleText,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { colors } from '@/constants/style';
import Entypo from '@expo/vector-icons/Entypo';
import { JSX } from 'react';
import SelectedIcon from '../Selected';

interface Props {
  title: string;
  content: JSX.Element[] | JSX.Element;
  value?: string;
  isActive?: boolean;
  onPress?: () => void;
}

const AccordionRow = ({ title, content, value, isActive, onPress }: Props) => {
  return (
    <AccordionItem {...(value ? { value } : { value: title })} className="mb-3">
      <AccordionHeader>
        <AccordionTrigger>
          {({ isExpanded }: { isExpanded: boolean }) => (
            <>
              {isActive && <SelectedIcon isSelected={isActive} />}
              <AccordionTitleText
                {...(onPress && { onPress })}
                className={`text-charcoal ${onPress ? 'font-normal text-black' : ''} ${isActive ? 'font-bold' : ''}`}
              >
                {title}
              </AccordionTitleText>
              <AccordionIcon
                as={() => (
                  <Entypo
                    name={
                      isExpanded ? 'chevron-small-up' : 'chevron-small-down'
                    }
                    size={24}
                    color={colors.charcoal}
                  />
                )}
              />
            </>
          )}
        </AccordionTrigger>
      </AccordionHeader>
      <AccordionContent>{content}</AccordionContent>
    </AccordionItem>
  );
};

export default AccordionRow;
