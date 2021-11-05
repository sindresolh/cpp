import { logRoles } from '@testing-library/dom';
import { PLAYER, CATEGORY } from './constants';

export const description =
  'lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum lorem ipsum';

export const sampleHandLists = {
  player1: [
    {
      id: 'cb-1',
      content: 'x = 1',
      player: PLAYER.P1,
      category: CATEGORY.VARIABLE,
    },
    {
      id: 'cb-2',
      content: 'y = 2',
      player: PLAYER.P1,
      category: CATEGORY.VARIABLE,
    },
  ],
  player2: [
    {
      id: 'cb-4',
      content: 'distractor4',
      player: PLAYER.P2,
      category: CATEGORY.VARIABLE,
    },
  ],
  player3: [
    {
      id: 'cb-10',
      content: 'distractor7',
      player: PLAYER.P3,
      category: CATEGORY.FUNCTION,
    },
  ],
  player4: [
    {
      id: 'cb-13',
      content: 'distractor10',
      player: PLAYER.P4,
      category: CATEGORY.VARIABLE,
    },
  ],
};

export const sampleField = {
  field: [
    {
      block: {
        id: 'cb-7',
        content: 'z = x + y',
        player: PLAYER.P1,
        category: CATEGORY.VARIABLE,
      },
      indent: 1,
    },
    {
      block: {
        id: 'cb-8',
        content: 'print(z)',
        player: PLAYER.P2,
        category: CATEGORY.FUNCTION,
      },
      indent: 2,
    },
  ],
};
