import update from 'immutability-helper';

/**
 * Move a code block in a hand list. Either swap position or move block from solution field.
 * @param {String} id identification of code block
 * @param {Number} index index to place block
 * @param {Array} blocksSF blocks in solution field
 * @param {Array} blocksHL blocks in hand list
 * @param {Number} handListIndex the index of the hand list
 * @param {Object} dispatches object containing dispatch functions
 */
export const moveBlockInHandList = (
  id,
  index,
  blocksSF,
  blocksHL,
  handListIndex,
  dispatches
) => {
  const { dispatch_listEvent } = dispatches;
  // perform moves locally before dispatching list event
  const blockObj = findBlock(id, blocksHL);
  // get block if it exists in handlist. undefined means the block came from a solutionfield. in that case, state will be updated elsewhere
  if (blockObj !== undefined) {
    swapBlockPositionInList(
      blockObj.block,
      blockObj.index,
      index,
      blocksHL,
      handListIndex,
      dispatches
    );
  }
  // move block from solution field to hand list
  else
    moveBlockFromField(
      id,
      index,
      blocksSF,
      blocksHL,
      handListIndex,
      dispatches
    );
  dispatch_listEvent(); // Move the block for the other players
};

/**
 * Move a code block in a solution field. Either swap position or move block from hand list.
 * @param {String} id identification of code block
 * @param {Number} index index to place block
 * @param {Number} indent indent to place block
 * @param {Array} blocksSF blocks in solution field
 * @param {Array} blocksHL blocks in all hand lists
 * @param {Object} dispatches object containing dispatch functions
 */
export const moveBlockInSolutionField = (
  id,
  index,
  indent,
  blocksSF,
  blocksHL,
  dispatches
) => {
  const { dispatch_fieldEvent } = dispatches;
  const blockObj = findBlock(id, blocksSF);
  if (blockObj === undefined) {
    // block does not exist in field, get from hand
    moveBlockFromList(id, index, blocksSF, blocksHL, dispatches);
  } else {
    // block came from the field, swap position
    swapBlockPositionInField(
      blockObj.block,
      blockObj.index,
      index,
      indent,
      blocksSF,
      dispatches
    );
  }
  dispatch_fieldEvent(); // Move the block for the other players
};

/**
 * Request a move to the host if it has not already been requested.
 * @param {Object} request
 * @param {Object} lastRequest
 * @param {Function} dispatch_moveRequest
 */
export const requestMove = (request, lastRequest, dispatch_moveRequest) => {
  if (!alreadyRequested(request, lastRequest)) dispatch_moveRequest(request);
};

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
 * @param {Object} dispatches object containing dispatch functions
 */
const moveBlockFromList = (id, index, solutionField, handLists, dispatches) => {
  const {
    dispatch_removeBlockFromList,
    dispatch_listEvent,
    dispatch_setFieldState,
  } = dispatches;
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
        dispatch_removeBlockFromList(id, handListIndex);
        dispatch_listEvent();
        const updatedBlocks = [
          ...solutionField.slice(0, index),
          movedBlock,
          ...solutionField.slice(index),
        ];
        dispatch_setFieldState(updatedBlocks);
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
 * @param {Object} dispatches object containing dispatch functions
 */
const moveBlockFromField = (
  id,
  index,
  solutionField,
  handList,
  handListIndex,
  dispatches
) => {
  const {
    dispatch_setList,
    dispatch_removeBlockFromField,
    dispatch_fieldEvent,
  } = dispatches;
  let movedBlock = solutionField.filter((block) => block.id === id)[0];
  const player = handListIndex + 1;

  // players cannot move their own blocks to another player's hand
  // a player can only move their own block to their own hand from solution field
  if (movedBlock !== undefined && movedBlock.player === player) {
    const updatedBlock = { ...movedBlock, indent: 0 }; // set indent to 0
    const updatedBlocks = [
      ...handList.slice(0, index),
      updatedBlock,
      ...handList.slice(index),
    ];

    dispatch_setList(updatedBlocks, handListIndex);
    dispatch_removeBlockFromField(id);
    dispatch_fieldEvent();
  }
};

/**
 * Swap a block position in the solution field.
 * @param {Object} block the block that should swap position
 * @param {Number} fromIndex which index the block came from
 * @param {Number} toIndex which index the block should be moved to
 * @param {Number} indent the indent to put the block at
 * @param {Array} solutionField the blocks in the solution field
 * @param {Object} dispatches object containing dispatch functions
 */
const swapBlockPositionInField = (
  block,
  fromIndex,
  toIndex,
  indent,
  solutionField,
  dispatches
) => {
  const { dispatch_setFieldState } = dispatches;
  let swappedBlock = { ...block };
  swappedBlock.indent = indent;
  const updatedBlocks = update(solutionField, {
    $splice: [
      [fromIndex, 1],
      [toIndex, 0, swappedBlock],
    ],
  });

  dispatch_setFieldState(updatedBlocks);
};

/**
 * Swap a block position in the hand list.
 * @param {Object} block
 * @param {Number} fromIndex
 * @param {Number} toIndex
 * @param {Array} handList
 * @param {Number} handListIndex
 * @param {Object} dispatches object containing dispatch functions
 */
const swapBlockPositionInList = (
  block,
  fromIndex,
  toIndex,
  handList,
  handListIndex,
  dispatches
) => {
  const { dispatch_setList } = dispatches;
  const updatedBlock = { ...block, indent: 0 }; // set indent to 0
  const updatedBlocks = update(handList, {
    $splice: [
      [fromIndex, 1],
      [toIndex, 0, updatedBlock],
    ],
  });

  dispatch_setList(updatedBlocks, handListIndex);
};

/**
 * Check if a move is already been requested to the host.
 * This prevents sending the same request repeatedly while hovering.
 * @param {object} move
 * @param {object} lastMoveRequest
 * @returns true if the move has been requested
 */
const alreadyRequested = (move, lastMoveRequest) => {
  if (
    move.id !== lastMoveRequest.id ||
    move.index !== lastMoveRequest.index ||
    move.indent !== lastMoveRequest.indent ||
    move.field !== lastMoveRequest.field
  )
    return false;
  return true;
};
