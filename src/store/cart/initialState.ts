import { initialStatus } from '@/constants/status';
import { CartState } from '@/types';

export const initialCartState: CartState = {
  items: null,
  count: 0,
  total: 0,
  status: {
    init: { ...initialStatus },
    updating: null,
  },
};
