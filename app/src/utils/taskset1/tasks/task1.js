import { PLAYER, CATEGORY } from '../../constants';

const handList = {
  correct: [
    {
      id: 'cb-1',
      content: 'x = 1',
      player: PLAYER.UNASSIGNED,
      category: CATEGORY.VARIABLE,
    },
    {
      id: 'cb-2',
      content: 'y = 2',
      player: PLAYER.UNASSIGNED,
      category: CATEGORY.VARIABLE,
    },
    {
      id: 'cb-7',
      content: 'z = x + y',
      player: PLAYER.UNASSIGNED,
      category: CATEGORY.VARIABLE,
    },
    {
      id: 'cb-8',
      content: 'print(z)',
      player: PLAYER.UNASSIGNED,
      category: CATEGORY.FUNCTION,
    },
  ],
  distractors: [
    {
      id: 'cb-3',
      content: 'distractor1',
      player: PLAYER.UNASSIGNED,
      category: CATEGORY.FUNCTION,
    },
    {
      id: 'cb-4',
      content: 'distractor4',
      player: PLAYER.UNASSIGNED,
      category: CATEGORY.VARIABLE,
    },
    {
      id: 'cb-5',
      content: 'distractor5',
      player: PLAYER.UNASSIGNED,
      category: CATEGORY.FUNCTION,
    },
    {
      id: 'cb-6',
      content: 'distractor3',
      player: PLAYER.UNASSIGNED,
      category: CATEGORY.VARIABLE,
    },
    {
      id: 'cb-10',
      content: 'distractor7',
      player: PLAYER.UNASSIGNED,
      category: CATEGORY.FUNCTION,
    },
    {
      id: 'cb-11',
      content: 'distractor8',
      player: PLAYER.UNASSIGNED,
      category: CATEGORY.FUNCTION,
    },
    {
      id: 'cb-12',
      content: 'distractor9',
      player: PLAYER.UNASSIGNED,
      category: CATEGORY.VARIABLE,
    },
    {
      id: 'cb-13',
      content: 'distractor10',
      player: PLAYER.UNASSIGNED,
      category: CATEGORY.VARIABLE,
    },
    {
      id: 'cb-14',
      content: 'distractor11',
      player: PLAYER.UNASSIGNED,
      category: CATEGORY.VARIABLE,
    },
    {
      id: 'cb-15',
      content: 'distractor12',
      player: PLAYER.UNASSIGNED,
      category: CATEGORY.FUNCTION,
    },
  ],
};

const solutionField = {
  correct: [
    {
      block: {
        id: 'cb-1',
        content: 'x = 1',
        category: CATEGORY.VARIABLE,
      },
      indent: 0,
    },
    {
      block: {
        id: 'cb-2',
        content: 'y = 2',
        category: CATEGORY.VARIABLE,
      },
      indent: 0,
    },
    {
      block: {
        id: 'cb-7',
        content: 'z = x + y',
        category: CATEGORY.VARIABLE,
      },
      indent: 0,
    },
    {
      block: {
        id: 'cb-8',
        content: 'print(z)',
        category: CATEGORY.FUNCTION,
      },
      indent: 0,
    },
  ],
  field: [
    {
      block: {
        id: 'cb-1',
        player: PLAYER.UNASSIGNED,
        content: 'x = 1',
        category: CATEGORY.VARIABLE,
      },
      indent: 0,
    },
  ],
};

export const task1 = {
  id: 1,
  description: 'Skriv et program som summerer to tall',
  hint: 'Begynn med å deklarere x',
  handList: handList,
  solutionField: solutionField,
};
