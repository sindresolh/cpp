import '@testing-library/jest-dom';
import { shuffleCodeblocks } from '../shuffleCodeblocks';
import { CATEGORY, PLAYER } from '../../constants';

const emptyArray = [[], [], [], []];
const someCodeblock = {
  id: 'cb-1',
  code: 'x = 1',
  player: PLAYER.UNASSIGNED,
  category: CATEGORY.VARIABLE,
};
const someDistractor = {
  id: 'cb-2',
  code: 'distractor',
  player: PLAYER.UNASSIGNED,
  category: CATEGORY.FUNCTION,
};
const wrongFormatArray = [1, '2', new Date()];
const correctFormatArray = [someCodeblock];

describe('test shuffleCodeBlocks function', () => {
  describe('test invalid parameters', () => {
    it('codeblocks is undefined', () => {
      expect(shuffleCodeblocks(null, undefined, 1)).toStrictEqual(emptyArray);
    });

    it('array does not follow the correct format', () => {
      expect(
        shuffleCodeblocks(wrongFormatArray, wrongFormatArray, 1)
      ).toStrictEqual(emptyArray);
    });

    it('invalid number of players', () => {
      expect(
        shuffleCodeblocks(correctFormatArray, correctFormatArray, 0)
      ).toStrictEqual(emptyArray);
    });

    it('negative number of players', () => {
      expect(
        shuffleCodeblocks(correctFormatArray, correctFormatArray, -1)
      ).toStrictEqual(emptyArray);
    });
  });

  describe('test that all players get at least one correct block', () => {
    it('assign the correct codeblock to the only players', () => {
      expect(shuffleCodeblocks(correctFormatArray, [], 1)).toStrictEqual([
        [someCodeblock],
        [],
        [],
        [],
      ]);
    });

    it('assign the correct codeblocks to the two players', () => {
      expect(
        shuffleCodeblocks([someCodeblock, someCodeblock], [], 2)
      ).toStrictEqual([[someCodeblock], [someCodeblock], [], []]);
    });

    it('assign the correct codeblocks to the 4 players', () => {
      expect(
        shuffleCodeblocks(
          [someCodeblock, someCodeblock, someCodeblock, someCodeblock],
          [],
          4
        )
      ).toStrictEqual([
        [someCodeblock],
        [someCodeblock],
        [someCodeblock],
        [someCodeblock],
      ]);
    });
  });

  describe('test that distractors shake things up', () => {
    it('assign correct and wrong codeblock', () => {
      expect(
        shuffleCodeblocks(correctFormatArray, [someDistractor], 1)
      ).not.toStrictEqual([[someCodeblock], [], [], []]);
    });
  });
});
