import { MotiView } from 'moti';
import { ReactNode } from 'react';

interface Props {
  pressedState: boolean;
  children: ReactNode;
  className: string;
}

const ScaleView = ({ pressedState, className, children }: Props) => {
  return (
    <MotiView className={className} animate={{ scale: pressedState ? 1.1 : 1 }}>
      {children}
    </MotiView>
  );
};

export default ScaleView;
