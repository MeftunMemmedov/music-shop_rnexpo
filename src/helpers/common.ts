export const createFakeImage = (w: number, h: number) =>
  `https://placehold.co/${w}x${h}.webp`;

export const debounce = (
  callback: (...args: any[]) => void,
  waitTime: number,
) => {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      //Type 'number' is not assignable to type 'Timeout'.
      callback(...args);
    }, waitTime);
  };
};

export const formatNumericInput = (text: string) => {
  return text.replace(/[^0-9]/g, '').replace(/^0+(?=\d)/, '');
};
