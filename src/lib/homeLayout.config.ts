import type { HomeLayoutItem } from './types';

export const homeLayout: HomeLayoutItem[] = [
  { id: 'hero', span: 'col-span-2 md:col-span-2 lg:col-span-2' },
  { id: 'wire', span: 'col-span-2 md:col-span-1 lg:col-span-2' },
  { id: 'scout', span: 'col-span-2 md:col-span-1 lg:col-span-1' },
  { id: 'player-database', span: 'col-span-2 md:col-span-2 lg:col-span-4' },
  { id: 'stats-dashboard', span: 'col-span-2 md:col-span-2 lg:col-span-4' },
  { id: 'legends-gallery', span: 'col-span-2 md:col-span-2 lg:col-span-4' },
];
