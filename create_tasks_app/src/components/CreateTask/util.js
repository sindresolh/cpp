import { CATEGORY } from './constants';

/**
 * Sorts an array into two based on condition
 *
 * Taken from: https://stackoverflow.com/a/38863774
 */
export const bifilter = (f, xs) => {
  return xs.reduce(
    ([T, F], x, i, arr) => {
      if (f(x, i, arr) === false) return [T, [...F, x]];
      else return [[...T, x], F];
    },
    [[], []]
  );
};

/**
 * Trims and checks for '$' to check if it's a distractor
 *
 * @param {String} line
 * @returns whether the line is a distractor or not
 */
export const isADistractor = (line) => {
  let trimmedLine = line.trim(); // remove empty spaces at the start
  return trimmedLine.startsWith('$', 1);
};

/**
 * Checks if the line is NOT a comment.
 * The line is trimmed to remove tabs or spaces. Then the first character is checked to be a '#'.
 * The line could still be a distractor, so the next character also has to be checked.
 *
 * @param {String} line
 * @returns whether the line is a comment or not
 */
export const isNotAComment = (line) => {
  const trimmed = line.trim();
  return !trimmed.startsWith('#', 0) || trimmed.startsWith('$', 1);
};

/**
 * @returns two arrays: codeblocks and distractors
 */
export const getCodeBlocksAndDistractors = (code) => {
  let lines = code.split('\n'); // split string on new line
  lines = lines.map((line) => line.trimEnd()); // remove any excess spaces at the end
  lines = lines.filter(isNotAComment); // remove comments, but check for '$' in case it is a distractor
  lines = lines.filter((line) => line.length !== 0); // remove empty lines
  let [distractors, codeBlocks] = bifilter(
    (line) => isADistractor(line),
    lines
  ); // split lines into codeblocks and distracors
  // remove '#' and '$' from distractors
  distractors = distractors.map((distractor) => distractor.replace('#', ''));
  distractors = distractors.map((distractor) => distractor.replace('$', ''));

  let codeBlockJSON = [];
  let distractorJSON = [];
  let id = 1;
  // categorize the code and create json objects
  codeBlocks.map((code) => {
    codeBlockJSON.push(getBlockAsObject(code, id));
    id++;
  });
  distractors.map((code) => {
    distractorJSON.push(getBlockAsObject(code, id));
    id++;
  });
  return [codeBlockJSON, distractorJSON];
};
/**
 * Get the block as an object.
 * @param {String} code the code of the block
 * @param {Number} id the id of the block
 */
const getBlockAsObject = (code, id) => {
  let category = categorizeCode(code.trim());
  //let indent = getIndent(code);
  let indent = 0; // TODO: hardcoded to be 0 for now until we add indenting
  id = String(id);
  code = code.trim();
  return { code, category, indent, id };
};

/**
 * Categorises a line of code.
 * @param {String} code
 * @returns {Number} category of code
 */
export const categorizeCode = (code) => {
  let category;
  if (isAVariable(code)) category = CATEGORY.VARIABLE;
  else if (isALoop(code)) category = CATEGORY.LOOP;
  else if (isAFunction(code)) category = CATEGORY.FUNCTION;
  else if (isACondition(code)) category = CATEGORY.CONDITION;
  else category = CATEGORY.UNDEFINED;

  return category;
};

/**
 * Tests whether a string is a Python variable.
 * @param {String} string a line of code
 * @returns true if the string is a variable decleration
 */
const isAVariable = (string) => {
  const regex =
    /^[a-zA-z0-9+*\-\[\]\s]+\s*?=\s*?[a-zA-Z0-9\[\]+*\-'"_\(\)\\\s:]+$/;
  return regex.test(string);
};
/**
 * Tests whether a string is a Python function.
 * A line of code falls into the function category if it is a
 * function decleration OR a function call.
 * E.g.: def my_function(arg): and my_function(arg) are both accepted.
 * @param {String} string a line of code
 * @returns true if the string is a function
 */
const isAFunction = (string) => {
  const regexFuncDecleration = /^def\s*?[a-zA-Z0-9'_()\[\]=":\s,*]+$/;
  const regexFuncCall = /^[a-zA-Z0-9\s_]+\([a-zA-Z0-9'_\[\]="\s,*]*\)$/;
  const regexKFuncKeyWords = /^return\s/;
  return (
    regexFuncDecleration.test(string) ||
    regexFuncCall.test(string) ||
    regexKFuncKeyWords.test(string)
  );
};

/**
 * Tests whether a string is a Python loop.
 * A line of code falls into the loop category if it is a
 * for- or a while loop.
 * @param {String} string a line of code
 * @returns true if the string is a loop
 */
const isALoop = (string) => {
  // const regexForLoop = /^for [a-zA-Z0-9_]+ in [a-zA-Z0-9'_()\[\]="\s,*]+:$/;
  const regexForLoop = /^(for\s)|(?=.*(\sfor\s))/; // TODO: Make this more advanced, for can come in a lot of variants (not only in the beginning)
  const regexWhileLoop = /^while [a-zA-Z0-9_()]+\s*[!=<>]*\s*[a-zA-Z0-9_()]+:$/;
  const regexLoopKeyWords = /(break|continue)$/;
  return (
    regexForLoop.test(string) ||
    regexWhileLoop.test(string) | regexLoopKeyWords.test(string)
  );
};

/**
 * Tests whether a string is a Python condition.
 * @param {String} string a line of code
 * @returns true if the string is a condition
 */
const isACondition = (string) => {
  const regex = /^\bif\b|\belif\b|\belse\b:?$/;
  return regex.test(string);
};
/**
 * Find the amount of spaces at the beginning of a string. 1 tab = 2 spaces.
 * @param {String} text
 * @returns how many tabs (indents) was found
 */
const getIndent = (text) => {
  var count = 0;
  var index = 0;
  while (text.charAt(index++) === ' ') {
    count++;
  }
  return count / 2;
};
