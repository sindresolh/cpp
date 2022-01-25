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
  // categorize the code and create json objects
  codeBlocks.map((block) => {
    let blockCategory = categorizeCode(block.trim());
    codeBlockJSON.push({ code: block, category: blockCategory });
  });
  distractors.map((distractor) => {
    let distractorCategory = categorizeCode(distractor.trim());
    distractorJSON.push({ code: distractor, category: distractorCategory });
  });

  return [codeBlockJSON, distractorJSON];
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
  const regex = /^[a-zA-z0-9]+\s*?=\s*?[a-zA-Z0-9'"_\(\)\\\s:]+$/;
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
  const regexFuncCall = /^[a-zA-Z0-9_]+\([a-zA-Z0-9'_\[\]="\s,*]*\)$/;
  return regexFuncDecleration.test(string) || regexFuncCall.test(string);
};

/**
 * Tests whether a string is a Python loop.
 * A line of code falls into the loop category if it is a
 * for- or a while loop.
 * @param {String} string a line of code
 * @returns true if the string is a loop
 */
const isALoop = (string) => {
  const regexForLoop = /^for [a-zA-Z0-9_]+ in [a-zA-Z0-9'_()\[\]="\s,*]+:$/;
  const regexWhileLoop = /^while [a-zA-Z0-9_()]+\s*[!=<>]*\s*[a-zA-Z0-9_()]+:$/;
  return regexForLoop.test(string) || regexWhileLoop.test(string);
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
