import { PLAYER, CATEGORY } from './constants';

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
    {
      id: 'cb-3',
      content: 'distractor1',
      player: PLAYER.P1,
      category: CATEGORY.FUNCTION,
    },
  ],
  player2: [
    {
      id: 'cb-4',
      content: 'distractor4',
      player: PLAYER.P2,
      category: CATEGORY.VARIABLE,
    },
    {
      id: 'cb-5',
      content: 'distractor5',
      player: PLAYER.P2,
      category: CATEGORY.FUNCTION,
    },
    {
      id: 'cb-6',
      content: 'distractor3',
      player: PLAYER.P2,
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
    {
      block: {
        id: 'cb-9',
        content: 'distractor2',
        player: PLAYER.P1,
        category: CATEGORY.VARIABLE,
      },
      indent: 3,
    },
  ],
};
