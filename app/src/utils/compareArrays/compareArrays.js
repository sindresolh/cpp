/**
 * Shallow equal check on two dimentional array
 * @param {array} arr1 previous state
 * @param {array} arr2  payload state
 * @returns true the arrays within the 2D array is equal
 */
export const twoDimensionalArrayIsEqual = (arr1, arr2) => {
  if (isNull(arr1, arr2)) return false;
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
  if (isNull(arr1, arr2)) return false;
  if (arr1.length !== arr2.length) return false;

  for (var i = 0; i < arr1.length; i++) {
    if (!objectIsEqual(arr1[i], arr2[i])) {
      return false;
    }
  }

  return true;
};

/**
 * Shallow equal check on array
 * @param {array} field solution proposal
 * @param {array} correct solution
 * @returns array with code and wheter or not it is correctly placed
 */
export const linebasedfeedback = (field, correct, otherSolutions = null) => {
  let equalAtIndex = [];
  if (isNull(field, correct)) return equalAtIndex;

  for (let i = 0; i < field.length; i++) {
    let isCorrect = false;

    if (objectIsEqual(field[i], correct[i])) {
      // codeblock is placed at correct location
      isCorrect = true;
    } else {
      // codeblock is placed incorrectly
      isCorrect = false;

      // check for alternative solutions
      if (otherSolutions != null) {
        for (let altSolution of otherSolutions) {
          if (objectIsEqual(field[i], altSolution[i])) {
            // codeblock is placed at correct location
            isCorrect = true;
          }
        }
      }
    }

    equalAtIndex.push({ codeBlock: field[i], isCorrect: isCorrect });
  }

  return equalAtIndex;
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
  if (isNull(object1, object2)) return false;
  if (typeof object1 !== 'object') {
    // not an object, check the values
    return object1 === object2;
  }
  object1 = removeProperties(object1);
  object2 = removeProperties(object2);

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

/**
 * Checks if the two inputs are null or undefined
 *
 * @param {*} var1
 * @param {*} var2
 * @returns
 */
const isNull = (var1, var2) => {
  if (var1 == null || var2 == null) {
    return true;
  }
};

/**
 * Remove the propery player and id from an object
 *
 * @param {*} obj
 * @returns
 */
const removeProperties = (obj) => {
  const objCopy = deepCopy(obj);
  if (obj.hasOwnProperty('player')) {
    delete objCopy.player;
  }
  if (obj.hasOwnProperty('index')) {
    delete objCopy.index;
  }
  if (obj.hasOwnProperty('id')) {
    delete objCopy.id;
  }
  return objCopy;
};

/** Create a deep copy of a variable
 *
 * @param {} element
 * @returns
 */
export const deepCopy = (element) => {
  return JSON.parse(JSON.stringify(element));
};
