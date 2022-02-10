import { PLAYER, CATEGORY } from '../../../../utils/constants';

export const sampleBlockP1 = {
  id: 'cb-1',
  code: 'x = 1',
  player: PLAYER.P1,
  category: CATEGORY.VARIABLE,
  indent: 0,
};

export const sampleBlockP2 = {
  id: 'cb-2',
  code: 'y = 2',
  player: PLAYER.P2,
  category: CATEGORY.VARIABLE,
  indent: 0,
};

export const sampleBlockP3 = {
  id: 'cb-3',
  code: 'z = x + y',
  player: PLAYER.P3,
  category: CATEGORY.VARIABLE,
  indent: 0,
};

export const sampleBlockP4 = {
  id: 'cb-4',
  code: 'print(z)',
  player: PLAYER.P4,
  category: CATEGORY.FUNCTION,
  indent: 0,
};
