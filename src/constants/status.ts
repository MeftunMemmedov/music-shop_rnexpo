export type Status = {
  loading: boolean;
  success: boolean;
  failure: boolean;
  lastAction?: string | null;
};

export const initialStatus: Status = {
  loading: false,
  success: false,
  failure: false,
};

export const LOADING = {
  loading: true,
  success: false,
  failure: false,
};

export const SUCCESS = {
  loading: false,
  success: true,
  failure: false,
};

export const FAILURE = {
  loading: false,
  success: false,
  failure: true,
};
