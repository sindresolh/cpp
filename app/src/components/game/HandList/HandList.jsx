import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import './HandList.css';
import { useSelector, useDispatch } from 'react-redux';
import {
  setList,
  removeBlockFromField,
  listEvent,
  fieldEvent,
  removeBlockFromList,
  addBlockToField,
  setFieldState,
  moveRequest,
} from '../../../redux/actions';
import update from 'immutability-helper';
import { ItemTypes } from '../../../utils/itemtypes';
import { useDrop } from 'react-dnd';
import store from '../../../redux/store/store';
import CodeLine from '../CodeLine/CodeLine';
import { objectIsEqual } from '../../../utils/compareArrays/compareArrays';

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

/**
 * This component represents a list of code blocks. Each player will have a list.
 * This list can accept dragged codeblocks if it is the correct player.
 *
 * @param {Number} player    which player owns the list
 * @param {Boolean} draggable   whether the player (the client) is allowed to drag the blocks in this list
 * @returns a div containing a list of codeblocks
 */
function HandList({ player, draggable }) {
  const dispatch = useDispatch();
  const handListIndex = player - 1;
  let blocks = useSelector((state) => state.handList[handListIndex]);
  blocks = blocks.map((block) => ({ ...block, indent: 0 })); // set indent to 0
  const emptyList = blocks.length === 0;

  // find the block and index based on id
  const findBlock = useCallback(
    (id) => {
      const block = blocks.filter((block) => block.id === id)[0];
      if (block === undefined) return undefined; // block came solution field

      return {
        block,
        index: blocks.indexOf(block),
      };
    },
    [blocks]
  );

  // update the position of the block when moved inside a list
  const moveBlock = useCallback(
    (id, atIndex, atIndent = 0) => {
      if (store.getState().host === '') {
        const blockObj = findBlock(id);
        // get block if it exists in handlist. undefined means the block came from a solutionfield. in that case, state will be updated elsewhere
        if (blockObj !== undefined) {
          swapBlockPositionInList(blockObj, atIndex);
        }
        // move block from solution field to hand list
        else moveBlockFromField(id, atIndex);
        dispatch(listEvent()); // Move the block for the other players
      } else {
        const move = {
          id,
          index: atIndex,
          indent: atIndent,
          field: player.toString(),
        };
        const lastMoveRequest = store.getState().moveRequest;

        if (!alreadyRequested(move, lastMoveRequest)) {
          // prevent continuosly dispatching before move happens
          dispatch(moveRequest(move));
        }
      }
    },
    [findBlock, blocks]
  );

  /**
   * Swap the position of the dragged block.
   * @param {object} block  the moved block and the original index
   * @param {*} atIndex     the new index of the block
   */
  const swapBlockPositionInList = (blockObj, atIndex) => {
    const updatedBlock = { ...blockObj.block, indent: 0 }; // set indent to 0
    const updatedBlocks = update(blocks, {
      $splice: [
        [blockObj.index, 1],
        [atIndex, 0, updatedBlock],
      ],
    });

    dispatch(setList(updatedBlocks, handListIndex));
  };

  /**
   * Move the dragged block from the field
   * and add it to the player's hand.
   * @param {string} id     the id of the moved block
   * @param {number} atIndex    the index the block is moved into
   */
  const moveBlockFromField = (id, atIndex) => {
    let fieldBlocks = store.getState().solutionField;
    let movedBlock = fieldBlocks.filter((block) => block.id === id)[0];

    // players cannot move their own blocks to another player's hand
    // a player can only move their own block to their own hand from solution field
    if (movedBlock !== undefined && movedBlock.player === player) {
      const updatedBlock = { ...movedBlock, indent: 0 }; // set indent to 0
      const updatedBlocks = [
        ...blocks.slice(0, atIndex),
        updatedBlock,
        ...blocks.slice(atIndex),
      ];

      dispatch(setList(updatedBlocks, handListIndex));
      dispatch(removeBlockFromField(id));
      dispatch(fieldEvent());
    }
  };

  // blocks can be dropped into empty hand list
  const [, emptyListDrop] = useDrop(
    () => ({
      accept: ItemTypes.CODEBLOCK,
      canDrop: () => emptyList,
      hover: (item) => {
        if (item.player === player && emptyList) {
          moveBlock(item.id);
        }
      },
    }),
    [blocks, emptyList]
  );

  /** Helper function to make sure that the field event is done before sending a new event
   *
   * @returns
   */
  const fieldEventPromise = () => {
    return Promise.resolve(dispatch(fieldEvent()));
  };

  /** Moves block from solutionfield to hand after a doubbleclick
   *
   * @param {*} e
   * @param {*} movedBlock : codeblock moved
   * @param {*} draggable : wheter or not the player has permission to perform this action
   */
  const handleDoubbleClick = (e, movedBlock, draggable) => {
    if (e.detail > 1 && draggable && movedBlock != null) {
      // (e.detauil > 1) if clicked more than once
      dispatch(removeBlockFromList(movedBlock.id, movedBlock.player - 1));
      dispatch(addBlockToField(movedBlock));
      fieldEventPromise().then(() => dispatch(listEvent()));
      e.detail = 0; // resets detail so that other codeblocks can be clicked
    }
  };

  return (
    <div className={'divHL'} ref={emptyListDrop} key={draggable}>
      <ul data-testid={`handList-player${player}`}>
        {blocks.map((block, index) => {
          return (
            <CodeLine
              block={block}
              index={index}
              moveBlock={moveBlock}
              maxIndent={0}
              draggable={draggable}
              key={`player-${player}-line-${index}`}
              handleDoubbleClick={handleDoubbleClick}
            />
          );
        })}
      </ul>
    </div>
  );
}

HandList.propTypes = {
  player: PropTypes.number,
  draggable: PropTypes.bool,
};

export default HandList;
