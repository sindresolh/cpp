import '@testing-library/jest-dom';
import {
  objectIsEqual,
  arrayIsEqual,
  twoDimensionalArrayIsEqual,
  linebasedfeedback,
} from '../compareArrays';

const somearray = [1, '2', new Date()];
const object1 = { var: 1, othervar: 'hello' };
const object2 = { somearray: somearray };
const someotherarray = [somearray, object1, object2];
const twoDimArr = [someotherarray, somearray];
const twoDimArr2 = [somearray, someotherarray];

describe('test the compare array functions', () => {
  describe('test objectIsEqual', () => {
    it('input is undefined', () => {
      expect(objectIsEqual(null, undefined)).toBe(false);
    });

    it('one of the objects is undefined', () => {
      expect(objectIsEqual(undefined, object1)).toBe(false);
    });

    it('input is variables', () => {
      expect(objectIsEqual(1, '')).toBe(false);
    });

    it('one of the objects is variables', () => {
      expect(objectIsEqual(object1, '')).toBe(false);
    });

    it('two equal objects', () => {
      expect(objectIsEqual(object1, { var: 1, othervar: 'hello' })).toBe(true);
    });

    it('two different objects', () => {
      expect(objectIsEqual(object1, object2)).toBe(false);
    });
  });

  describe('test arrayIsEqual', () => {
    it('input is undefined', () => {
      expect(arrayIsEqual(null, undefined)).toBe(false);
    });

    it('one of the arrays is undefined', () => {
      expect(arrayIsEqual(undefined, somearray)).toBe(false);
    });

    it('input is variables', () => {
      expect(arrayIsEqual(1, '')).toBe(false);
    });

    it('one of the inputs is a variable', () => {
      expect(arrayIsEqual(somearray, '')).toBe(false);
    });

    it('two equal arrays', () => {
      expect(arrayIsEqual(somearray, [1, '2', new Date()])).toBe(true);
    });

    it('two different arrays', () => {
      expect(arrayIsEqual(somearray, someotherarray)).toBe(false);
    });
  });

  describe('test twoDimensionalArrayIsEqual', () => {
    it('input is undefined', () => {
      expect(twoDimensionalArrayIsEqual(null, undefined)).toBe(false);
    });

    it('one of the 2D arrays is undefined', () => {
      expect(twoDimensionalArrayIsEqual(undefined, twoDimArr)).toBe(false);
    });

    it('input is variables', () => {
      expect(twoDimensionalArrayIsEqual(1, '')).toBe(false);
    });

    it('one of the inputs is a variable', () => {
      expect(twoDimensionalArrayIsEqual(twoDimArr, '')).toBe(false);
    });

    it('two equal 2D arrays', () => {
      expect(arrayIsEqual(twoDimArr, [someotherarray, somearray])).toBe(true);
    });

    it('two different 2D arrays', () => {
      expect(twoDimensionalArrayIsEqual(twoDimArr, twoDimArr2)).toBe(false);
    });
  });

  describe('test linebasedfeedback', () => {
    it('solution is null', () => {
      expect(linebasedfeedback(null, undefined)).toStrictEqual([]);
    });

    it('solution is undefined', () => {
      expect(linebasedfeedback(undefined, undefined)).toStrictEqual([]);
    });

    it('solution is empty', () => {
      expect(linebasedfeedback([], undefined)).toStrictEqual([]);
    });

    it('correct is null', () => {
      expect(linebasedfeedback(['test'], null)).toStrictEqual([]);
    });

    it('field decide length of 1', () => {
      expect(linebasedfeedback(['test'], []).length).toBe(1);
    });

    it('field decide lengtht of 3', () => {
      expect(linebasedfeedback(somearray, ['test']).length).toBe(3);
    });

    it('no match gives false', () => {
      expect(linebasedfeedback(['test'], [])[0].isCorrect).toBe(false);
    });

    it('wrong match gives false', () => {
      expect(linebasedfeedback(['test'], ['hallo'])[0].isCorrect).toBe(false);
    });

    it('correct match gives true', () => {
      expect(linebasedfeedback(['test'], ['test'])[0].isCorrect).toBe(true);
    });
  });
});
