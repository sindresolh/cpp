import { PLAYER, CATEGORY } from '../../constants';

const handList = {
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
    {
      id: 'cb-5',
      content: 'distractor5',
      player: PLAYER.P2,
      category: CATEGORY.FUNCTION,
    },
  ],
  player3: [
    {
      id: 'cb-10',
      content: 'distractor7',
      player: PLAYER.P3,
      category: CATEGORY.FUNCTION,
    },
    {
      id: 'cb-11',
      content: 'distractor8',
      player: PLAYER.P3,
      category: CATEGORY.FUNCTION,
    },
    {
      id: 'cb-12',
      content: 'distractor9',
      player: PLAYER.P3,
      category: CATEGORY.VARIABLE,
    },
  ],
  player4: [
    {
      id: 'cb-13',
      content: 'distractor10',
      player: PLAYER.P4,
      category: CATEGORY.VARIABLE,
    },
    {
      id: 'cb-14',
      content: 'distractor11',
      player: PLAYER.P4,
      category: CATEGORY.VARIABLE,
    },
    {
      id: 'cb-15',
      content: 'distractor12',
      player: PLAYER.P4,
      category: CATEGORY.FUNCTION,
    },
  ],
};

const solutionField = {
  field: [],
  correct: [],
};

export const task2 = {
  id: 2,
  description: 'Dette er en helt annen oppgave.',
  handList: handList,
  solutionField: solutionField,
};
