import Entypo from '@expo/vector-icons/Entypo';

const SelectedIcon = ({ isSelected }: { isSelected: boolean }) => {
  if (!isSelected) return;
  if (isSelected) return <Entypo name="check" size={14} color="black" />;
};

export default SelectedIcon;
