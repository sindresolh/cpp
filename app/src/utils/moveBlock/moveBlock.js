import update from 'immutability-helper';

// TODO: dispatches

export const moveBlock = (id, index, indent, blocksSF, blocksHL) => {};

export const requestMove = (request, lastRequest) => {};

/**
 * Try to find a block in an array based on id.
 * If block is not in the array return undefined
 * @param {String} id identifier for a block
 * @param {Array} blocks an array with blocks (solutionfield or handlist)
 * @returns the block and its index OR undefined
 */
const findBlock = (id, blocks) => {
  const block = blocks.filter((block) => block.id === id)[0];
  if (block === undefined) return undefined; // block came from somewhere else
  const index = blocks.indexOf(block);

  return {
    block,
    index,
  };
};

/**
 * Move a block from a hand list to the solution field.
 * @param {String} id identification of the block to be moved
 * @param {Number} index the index where the block should be moved to
 * @param {Array} solutionField blocks in the solution field
 * @param {Array} handLists blocks for all players
 */
const moveBlockFromList = (id, index, solutionField, handLists) => {
  let blockIsNotFound = true;
  let handListIndex = 0;
  let movedBlock;
  const AMOUNT_OF_PLAYERS = 4;

  // find block and update the correct hand list
  while (blockIsNotFound && handListIndex < AMOUNT_OF_PLAYERS) {
    for (let block = 0; block < handLists[handListIndex].length; block++) {
      if (handLists[handListIndex][block].id === id) {
        // block is found, stop looking
        blockIsNotFound = false;
        movedBlock = handLists[handListIndex][block];
        dispatch(removeBlockFromList(id, handListIndex));
        dispatch(listEvent());
        const updatedBlocks = [
          ...solutionField.slice(0, index),
          movedBlock,
          ...solutionField.slice(index),
        ];
        dispatch(setFieldState(updatedBlocks));
      }
    }
    handListIndex++;
  }
};

/**
 * Move a block from the solution field to a hand list.
 * @param {String} id identification of the block to be moved
 * @param {Number} index the index where the block should be moved to
 * @param {Array} solutionField blocks in the solution field
 * @param {Array} handList blocks in the hand list
 * @param {Number} handListIndex index of the handlist
 */
const moveBlockFromField = (
  id,
  index,
  solutionField,
  handList,
  handListIndex
) => {
  let movedBlock = solutionField.filter((block) => block.id === id)[0];

  // players cannot move their own blocks to another player's hand
  // a player can only move their own block to their own hand from solution field
  if (movedBlock !== undefined && movedBlock.player === player) {
    const updatedBlock = { ...movedBlock, indent: 0 }; // set indent to 0
    const updatedBlocks = [
      ...handList.slice(0, index),
      updatedBlock,
      ...handList.slice(index),
    ];

    dispatch(setList(updatedBlocks, handListIndex));
    dispatch(removeBlockFromField(id));
    dispatch(fieldEvent());
  }
};

/**
 * Swap a block position in the solution field.
 * @param {Object} block the block that should swap position
 * @param {Number} fromIndex which index the block came from
 * @param {Number} toIndex which index the block should be moved to
 * @param {Number} indent the indent to put the block at
 * @param {Array} solutionField the blocks in the solution field
 */
const swapBlockPositionInField = (
  block,
  fromIndex,
  toIndex,
  indent,
  solutionField
) => {
  let swappedBlock = { ...block };
  swappedBlock.indent = indent;
  const updatedBlocks = update(solutionField, {
    $splice: [
      [fromIndex, 1],
      [toIndex, 0, swappedBlock],
    ],
  });

  dispatch(setFieldState(updatedBlocks));
};

/**
 * Swap a block position in the hand list.
 * @param {Object} block
 * @param {Number} fromIndex
 * @param {Number} toIndex
 * @param {Array} handList
 * @param {Number} handListIndex
 */
const swapBlockPositionInList = (
  block,
  fromIndex,
  toIndex,
  handList,
  handListIndex
) => {
  const updatedBlock = { ...block, indent: 0 }; // set indent to 0
  const updatedBlocks = update(handList, {
    $splice: [
      [fromIndex, 1],
      [toIndex, 0, updatedBlock],
    ],
  });

  dispatch(setList(updatedBlocks, handListIndex));
};
