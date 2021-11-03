import React, { useEffect, useCallback } from 'react';
import CodeBlock from '../CodeBlock/CodeBlock';
import PropTypes from 'prop-types';
import './HandList.css';
import { useSelector, useDispatch } from 'react-redux';
import { addBlock, setList, removeBlockFromField } from '../../redux/actions';
import update from 'immutability-helper';
import { ItemTypes } from '../../utils/itemtypes';
import { useDrop } from 'react-dnd';
import store from '../../redux/store/store';

/**
 * This component represents a list of code blocks. Each player will have a list.
 * This list can accept dragged codeblocks if it is the correct player.
 *
 * @param {Array} codeBlocks    code blocks in the list
 * @param {Number} player   which player owns the list
 * @returns a div containing a list of codeblocks
 */
function HandList({ codeBlocks, player }) {
  const dispatch = useDispatch();
  const handListIndex = player - 1;
  const blocks = useSelector((state) => state.handList[handListIndex]);
  console.log('blogs length', blocks.length);
  const emptyList = blocks.length === 0;

  // Only set the list on initial render. This might not be an ideal solution -H
  useEffect(() => {
    dispatch(setList(codeBlocks, handListIndex));
  }, []);

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
      let updatedBlocks;
      const block = findBlock(id);

      // get block if it exists in handlist. undefined means the block came from a solutionfield. in that case, state will be updated elsewhere
      if (block !== undefined) {
        updatedBlocks = update(blocks, {
          $splice: [
            [block.index, 1],
            [atIndex, 0, block.block],
          ],
        });

        dispatch(setList(updatedBlocks, handListIndex));

        // move block from solution field to hand list
      } else {
        let solutionField = store.getState().solutionField;
        let movedBlock = solutionField.filter(
          (line) => line.block.id === id
        )[0];

        // players cannot move their own blocks to another player's hand
        // a player can only move their own block to their own hand from solution field
        if (movedBlock !== undefined && movedBlock.block.player === player) {
          movedBlock = movedBlock.block;
          updatedBlocks = [
            ...blocks.slice(0, atIndex),
            movedBlock,
            ...blocks.slice(atIndex),
          ];

          dispatch(setList(updatedBlocks, handListIndex));
          dispatch(removeBlockFromField(id));
        }
      }
    },
    [findBlock, blocks]
  );

  // blocks can be dropped into empty hand list
  const [, drop] = useDrop(
    () => ({
      accept: ItemTypes.CODEBLOCK,
      canDrop: () => emptyList,
      drop: (item) => {
        if (item.player === player) {
          const solutionField = store.getState().solutionField;
          const line = solutionField.filter(
            (line) => line.block.id === item.id
          )[0];
          const block = line.block;

          // only allow dropping into empty list if it's the player's block
          dispatch(setList([block], handListIndex));
          dispatch(removeBlockFromField(item.id));
        }
      },
    }),
    [blocks]
  );

  return (
    <div className={'divHL'} ref={drop}>
      <h6>player {player}</h6>
      <ul data-testid={`handList-player${player}`}>
        {blocks.map((codeBlock) => {
          return (
            <li className={'li'} key={codeBlock.id}>
              <CodeBlock
                {...codeBlock}
                moveBlock={moveBlock}
                findBlock={findBlock}
              />
            </li>
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
