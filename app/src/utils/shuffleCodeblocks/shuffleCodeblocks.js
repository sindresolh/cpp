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

const oneBlockPerPlayer = (
  startindex,
  end_index,
  correctBlocks,
  codeblocks
) => {
  for (let i = startindex; i < end_index; i++) {
    let block = correctBlocks.pop();
    block.player = i + 1;
    codeblocks[i].push(block);
  }
  return codeblocks;
};

export const shuffleCodeblocks = (
  correctBlocks,
  distractors,
  numberOfPlayers
) => {
  let codeblocks = [[], [], [], []]; // codeblocks for all 4 players
  let start_index = 0;
  let end_index = numberOfPlayers;

  // Verify input
  if (
    wrongFormat(correctBlocks) ||
    wrongFormat(distractors) ||
    numberOfPlayers < 1
  ) {
    return codeblocks;
  }

  correctBlocks = shuffle(correctBlocks);

  // If there is at least as many correct codeblocks as players: make sure everyone gets one
  if (correctBlocks.length >= numberOfPlayers) {
    // There is enough codeblocks for everyone, do nothing
  }
  // Else check if there is enough total codeblocks to give one block for each player
  else if (distractors.length + correctBlocks.length >= numberOfPlayers) {
    let numberOfDistractorsToAdd = numberOfPlayers - correctBlocks.length;
    distractors = shuffle(distractors);
    let removed = distractors.splice(0, numberOfDistractorsToAdd);
    correctBlocks = correctBlocks.concat(removed);
  } else {
    alert('wololo');
    // We have less than total codeblocks than player. Make sure no players get more than 1 block.
    let total_codeblocks = distractors.length + correctBlocks.length;
    // Calculate which player to start handing out codeblocks to
    start_index = Math.floor(
      Math.random() * (numberOfPlayers - total_codeblocks + 1) // Random int between 0 and numbers of players that will not recive any codeblocks
    );
    end_index = total_codeblocks + start_index;

    alert(
      'start_index: ' +
        start_index +
        ' , players: ' +
        numberOfPlayers +
        ' , codeblocks: ' +
        total_codeblocks
    );
  }

  // Give one block to each player (and none to some if there are less blocks than players)
  codeblocks = oneBlockPerPlayer(
    start_index,
    end_index,
    correctBlocks,
    codeblocks
  );

  let remainingBlocks = correctBlocks.concat(distractors);
  remainingBlocks = shuffle(remainingBlocks);

  // Give the players the remaining blocks
  for (let block of remainingBlocks) {
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
    var codeblock = field.pop();
    codeblock.indent = 0;
    var player = codeblock.player - 1;

    if (player >= 0) {
      handList[player].push(codeblock);
    }
  }
  return handList;
};
