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
      !block.hasOwnProperty('content') ||
      !block.hasOwnProperty('category') ||
      !block.hasOwnProperty('player')
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
    let player = Math.floor(Math.random() * numberOfPlayers); // random int between 0 and 3
    block.player = player + 1;
    codeblocks[player].push(block);
  }

  return codeblocks;
};
