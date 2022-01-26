import { deepCopy } from '../compareArrays/compareArrays';

/**
 * Fisher-Yates algorithm
 * Taken from: https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 *
 * @param {*} array
 * @returns
 */
function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

/**
 * Verifies if the array of codeblocks follows the correct format
 *
 * @param {*} blocks : array of codeblocks
 * @returns
 */
const wrongFormat = (blocks) => {
  if (blocks == null) {
    return true;
  }

  for (var block of blocks) {
    if (
      !block.hasOwnProperty('id') ||
      !block.hasOwnProperty('code') ||
      !block.hasOwnProperty('category') //||
      //!block.hasOwnProperty('player')
    ) {
      return true;
    }
  }
  return false;
};

export const shuffleCodeblocks = (
  correctBlocks,
  distractors,
  numberOfPlayers
) => {
  let codeblocks = [[], [], [], []]; // codeblocks for all 4 players

  // Verify input
  if (
    wrongFormat(correctBlocks) ||
    wrongFormat(distractors) ||
    numberOfPlayers < 1
  ) {
    return codeblocks;
  }

  correctBlocks = shuffle(correctBlocks);

  // Make sure that each player gets a correct codeblock
  if (correctBlocks.length >= numberOfPlayers) {
    for (let i = 0; i < numberOfPlayers; i++) {
      let block = correctBlocks.pop();
      block.player = i + 1;
      codeblocks[i].push(block);
    }
  }

  let remainingBlocks = correctBlocks.concat(distractors);
  remainingBlocks = shuffle(remainingBlocks);

  // Give the players the remaining blocks
  for (var block of remainingBlocks) {
    let player = Math.floor(Math.random() * numberOfPlayers) + 1; // random int between 1 and 4
    block.player = player;
    codeblocks[player - 1].push(block);
  }

  // Make sure that the correct codeblocks is not always the first ones
  for (let player = 0; player < numberOfPlayers; player++) {
    codeblocks[player] = shuffle(codeblocks[player]);
  }

  return codeblocks;
};

/**
 * Take the field blocks and give them to the correct player
 *
 * @param {*} field
 * @param {*} handList
 * @returns
 */
export const clearBoard = (field, handList) => {
  field = deepCopy(field);
  while (field.length > 0) {
    var codeblock = field.pop().block;
    var player = codeblock.player - 1;

    if (player > 0) {
      handList[player].push(codeblock);
    }
  }

  return handList;
};
