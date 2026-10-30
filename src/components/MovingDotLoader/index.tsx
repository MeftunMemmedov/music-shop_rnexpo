import { AnimatePresence, MotiView } from 'moti';

interface MovingDotLoaderProps {
  dotClassName: string;
  range?: number;
  duration?: number;
}

export const MovingDotLoader: React.FC<MovingDotLoaderProps> = ({
  dotClassName,
  range = 30,
  duration = 1000,
}) => {
  return (
    <AnimatePresence>
      <MotiView
        from={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        className="w-full flex-row items-center justify-center"
      >
        <MotiView
          animate={{
            translateX: [0, range, -range, 0],
          }}
          transition={{
            type: 'timing',
            duration: duration,
            loop: true,
          }}
          className={`size-5 rounded-full ${dotClassName}`}
        />
      </MotiView>
    </AnimatePresence>
  );
};
