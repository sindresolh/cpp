import update from 'immutability-helper';

// TODO: dispatches

export const moveBlockInHandList = (id, index, indent, blocksSF, blocksHL) => {
  // perform moves locally before dispatching list event
  const blockObj = findBlock(id);
  // get block if it exists in handlist. undefined means the block came from a solutionfield. in that case, state will be updated elsewhere
  if (blockObj !== undefined) {
    swapBlockPositionInList(blockObj, atIndex);
  }
  // move block from solution field to hand list
  else moveBlockFromField(id, atIndex);
  dispatch(listEvent()); // Move the block for the other players
};

export const moveBlockInSolutionField = (
  id,
  index,
  indent,
  blocksSF,
  blocksHL
) => {
  // perform move locally before dispatching field event
  const block = findBlock(id);
  if (block === undefined) {
    // block does not exist in field, get from hand
    moveBlockFromList(id, atIndex);
  } else {
    // block came from the field, swap position
    swapBlockPositionInField(block, atIndex, atIndent);
  }
  dispatch(fieldEvent()); // Move the block for the other players
};

export const moveBlockInHandler = (id, index, indent, blocksSF, blocksHL) => {
  let blocks;
  const player = parseInt(moveRequest.field);
  const handListIndex = player - 1;
  const isAMoveInSolutionField = moveRequest.field === 'SF';

  // get blocks from solution field or handlist depending on where the move is performed
  blocks = isAMoveInSolutionField
    ? store.getState().solutionField
    : store.getState().handList[handListIndex];

  const block = this.findBlock(moveRequest.id, blocks);

  // swaps block position in handlist/solution field OR move it from list/field to the other
  if (block === undefined) {
    if (isAMoveInSolutionField)
      this.moveBlockFromList(moveRequest.id, moveRequest.index);
    else this.moveBlockFromField(moveRequest.id, moveRequest.index, player);
  } else {
    if (isAMoveInSolutionField)
      this.swapBlockPositionInField(
        block,
        moveRequest.index,
        moveRequest.indent
      );
    else this.swapBlockPositionInList(block, moveRequest.index, player);
  }
};

export const requestMove = (request, lastRequest) => {
  if (!alreadyRequested(move, lastMoveRequest)) dispatch(moveRequest(move));
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
