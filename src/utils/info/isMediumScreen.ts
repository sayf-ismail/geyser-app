import { useMediaQuery } from '@chakra-ui/media-query';

export const isMediumScreen = (): boolean => {
  const [isLargerThan1280] = useMediaQuery('(min-width: 1280px)');

  return !isLargerThan1280;
};