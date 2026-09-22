import { useWindowDimensions } from 'react-native';

interface ResponsiveState {
  isMobile: boolean;
  isTablet: boolean;
  isLandscape: boolean;
  isPortrait: boolean;
  width: number;
  height: number;
}

const useResponsive = (): ResponsiveState => {
  const { width, height } = useWindowDimensions();

  const isMobile = width < 768;
  const isTablet = width >= 768;

  const isLandscape = width > height;
  const isPortrait = height >= width;

  return {
    isMobile,
    isTablet,
    isLandscape,
    isPortrait,
    width,
    height,
  };
};

export default useResponsive;
