import type { HomeLayoutItem } from './types';

export const homeLayout: HomeLayoutItem[] = [
  { id: 'hero', span: 'md:col-span-2 lg:col-span-1' }, // Takes full width of the 2-col grid
  { id: 'wire', span: 'md:col-span-1 lg:col-span-1' }, // Takes 1 column (half width)
  { id: 'scout', span: 'md:col-span-1 lg:col-span-1' }, // Takes 1 column (half width)
];
