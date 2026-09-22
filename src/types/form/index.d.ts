import { Path } from 'react-hook-form';

export type FormFields<T> = {
  label: string;
  name: Path<T>;
  required?: boolean;
  readonly?: boolean;
}[];
