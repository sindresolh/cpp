import React, { useCallback } from 'react';
import CodeBlock from '../CodeBlock/CodeBlock';
import PropTypes from 'prop-types';
import './HandList.css';
import { useSelector, useDispatch } from 'react-redux';
import {
  addBlock,
  setList,
  removeBlockFromField,
  listEvent,
  fieldEvent,
} from '../../redux/actions';
import update from 'immutability-helper';
import { ItemTypes } from '../../utils/itemtypes';
import { useDrop } from 'react-dnd';
import store from '../../redux/store/store';
import CodeLine from '../CodeLine/CodeLine';

/**
 * This component represents a list of code blocks. Each player will have a list.
 * This list can accept dragged codeblocks if it is the correct player.
 *
 * @param {Array} codeBlocks    code blocks in the list
 * @param {Number} player   which player owns the list
 * @returns a div containing a list of codeblocks
 */
function HandList({ player, draggable }) {
  const dispatch = useDispatch();
  const handListIndex = player - 1;
  const blocks = useSelector((state) => state.handList[handListIndex]);
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
    (id, atIndex, atIndent = 0, playerNo) => {
      const block = findBlock(id);

      // get block if it exists in handlist. undefined means the block came from a solutionfield. in that case, state will be updated elsewhere
      if (block !== undefined) swapBlockPositionInList(block, atIndex);
      // move block from solution field to hand list
      else moveBlockFromField(id, atIndex);

      dispatch(listEvent()); // Move the block for the other players
    },
    [findBlock, blocks]
  );

  /**
   * Swap the position of the dragged block.
   * @param {object} block  the moved block and the original index
   * @param {*} atIndex     the new index of the block
   */
  const swapBlockPositionInList = (block, atIndex) => {
    const updatedBlocks = update(blocks, {
      $splice: [
        [block.index, 1],
        [atIndex, 0, block.block],
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
    let solutionField = store.getState().solutionField;
    let movedBlock = solutionField.filter((line) => line.block.id === id)[0];

    // players cannot move their own blocks to another player's hand
    // a player can only move their own block to their own hand from solution field
    if (movedBlock !== undefined && movedBlock.block.player === player) {
      movedBlock = movedBlock.block;
      const updatedBlocks = [
        ...blocks.slice(0, atIndex),
        movedBlock,
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

  return (
    <div className={'divHL'} ref={emptyListDrop}>
      <ul data-testid={`handList-player${player}`}>
        {blocks.map((block, index) => {
          return (
            <CodeLine
              block={block}
              indent={0}
              index={index}
              moveBlock={moveBlock}
              key={`player-${player}-line-${index}`}
            />
          );
        })}
      </ul>
    </div>
  );
}

HandList.propTypes = {
  codeBlocks: PropTypes.array,
  player: PropTypes.number,
};

export default HandList;
