import { PLAYER, CATEGORY } from '../../../../utils/constants';

export const sampleField = {
  field: [
    {
      block: {
        id: 'cb-1',
        content: 'x = 1',
        player: PLAYER.P1,
        category: CATEGORY.VARIABLE,
      },
      indent: 0,
    },
    {
      block: {
        id: 'cb-2',
        content: 'y = 2',
        player: PLAYER.P1,
        category: CATEGORY.VARIABLE,
      },
      indent: 0,
    },
    {
      block: {
        id: 'cb-3',
        content: 'z = x + y',
        player: PLAYER.P1,
        category: CATEGORY.VARIABLE,
      },
      indent: 0,
    },
    {
      block: {
        id: 'cb-4',
        content: 'print(z)',
        player: PLAYER.P1,
        category: CATEGORY.FUNCTION,
      },
      indent: 0,
    },
  ],
};
