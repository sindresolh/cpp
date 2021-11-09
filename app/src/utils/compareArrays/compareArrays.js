/**
 * Shallow equal check on two dimentional array
 * @param {array} arr1 previous state
 * @param {array} arr2  payload state
 * @returns true the arrays within the 2D array is equal
 */
export const twoDimensionalArrayIsEqual = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false;

  for (var i = 0; i < arr1.length; i++) {
    if (!arrayIsEqual(arr1[i], arr2[i])) return false;
  }

  return true;
};

/**
 * Shallow equal check on array
 * @param {array} arr1 previous state
 * @param {array} arr2 payload state
 * @returns true if all the objects and values within the array is equal
 */
export const arrayIsEqual = (arr1, arr2) => {
  if (arr1.length !== arr2.length) return false;
  for (var i = 0; i < arr1.length; i++) {
    if (!objectIsEqual(arr1[i], arr2[i])) {
      return false;
    }
  }

  return true;
};

/**
 *  Check if all keys in an object is equal.
 * Since this function is used recursively, check if the object is a value.
 *
 * Code is taken from: https://dmitripavlutin.com/how-to-compare-objects-in-javascript/#3-shallow-equality
 * @param {object or value} object1 block or indent value
 * @param {object or value} object2 block or indent value
 * @returns true if all keys in an object are equal
 */
export const objectIsEqual = (object1, object2) => {
  if (typeof object1 !== 'object') {
    // not an object, check the values
    return object1 === object2;
  }
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (let key of keys1) {
    if (!objectIsEqual(object1[key], object2[key])) {
      return false;
    }
  }
  return true;
};
