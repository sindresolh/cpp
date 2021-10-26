import { PLAYER, CATEGORY } from '../constants';

export const sampleBlockP1 = {
  id: 'cb-1',
  content: 'x = 1',
  player: PLAYER.P1,
  category: CATEGORY.VARIABLE,
};

export const sampleBlockP2 = {
  id: 'cb-2',
  content: 'y = 2',
  player: PLAYER.P2,
  category: CATEGORY.VARIABLE,
};

export const sampleBlockP3 = {
  id: 'cb-3',
  content: 'z = x + y',
  player: PLAYER.P3,
  category: CATEGORY.VARIABLE,
};

export const sampleBlockP4 = {
  id: 'cb-4',
  content: 'print(z)',
  player: PLAYER.P4,
  category: CATEGORY.FUNCTION,
};
