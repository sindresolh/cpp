import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CodeBlock from '../CodeBlock/CodeBlock';
import CodeLine from '../CodeLine/CodeLine';
import { useCallback } from 'react';
import {
  setFieldState,
  removeBlockFromList,
  fieldEvent,
  listEvent,
} from '../../redux/actions';
import update from 'immutability-helper';
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../../utils/itemtypes';
import PropTypes from 'prop-types';
import './SolutionField.css';
import store from '../../redux/store/store';
import { COLORS, MAX_INDENT } from '../../utils/constants';
import { useRef } from 'react';
import { useEffect } from 'react';

/**
 * The field the players can move blocks into.
 * The field contains codelines which allows indenting of blocks, as well as
 * swapping positions by dragging.
 *
 * @returns a div containing the blocks players has moved blocks into
 */
function SolutionField({}) {
  const blocks = useSelector((state) => state.solutionField);
  const players = useSelector((state) => state.players);
  const dispatch = useDispatch();

  // finds the block, it's index and indent based on id
  const findBlock = useCallback(
    (id) => {
      const block = blocks.filter((block) => block.id === id)[0];
      if (block === undefined) return undefined; // block came from a hand list
      const blockIndex = blocks.indexOf(block);

      return {
        block,
        index: blockIndex,
      };
    },
    [blocks]
  );

  // move the block within the field or to a hand list
  const moveBlock = useCallback(
    (id, atIndex, atIndent = 0) => {
      // get block if it exists in solutionfield
      const block = findBlock(id);
      if (block === undefined) {
        // block does not exist in field, get from hand
        moveBlockFromList(id, atIndex);
      } else {
        // block came from the field, swap position
        swapBlockPositionInField(block, atIndex, atIndent);
      }
      dispatch(fieldEvent()); // Move the block for the other players
    },
    [findBlock, blocks]
  );

  /**
   * Swap the position of the dragged block.
   * @param {object} blockObj     the block and it's originalindex
   * @param {number} atIndex      the new index the block was dragged into
   * @param {number} atIndent     the indent the block was dragged into
   */
  const swapBlockPositionInField = (blockObj, atIndex, atIndent) => {
    let block = blockObj.block;
    block.indent = atIndent;
    const updatedBlocks = update(blocks, {
      $splice: [
        [blockObj.index, 1],
        [atIndex, 0, block],
      ],
    });

    dispatch(setFieldState(updatedBlocks));
  };

  /**
   * Move the dragged block from the list it came from
   * and add it to the solution field.
   * @param {string} id the id of the block that was dragged
   * @param {number} atIndex    the index it was dragged into
   */
  const moveBlockFromList = (id, atIndex) => {
    const handLists = store.getState().handList;
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
            ...blocks.slice(0, atIndex),
            movedBlock,
            ...blocks.slice(atIndex),
          ];
          dispatch(setFieldState(updatedBlocks));
        }
      }
      handListIndex++;
    }
  };

  const [, emptyLineDrop] = useDrop(
    () => ({
      accept: ItemTypes.CODEBLOCK,
      hover: (item, monitor) => {
        moveBlock(item.id, blocks.length, 0); // only allow drop in empty field if it comes from hand
      },
    }),
    [blocks]
  );

  return (
    <div className={'divSF'} style={{ background: COLORS.solutionfield }}>
      <h6>{'Connected platers: ' + players.length}</h6>
      <ul data-testid='solutionField'>
        {blocks.map((block, index) => {
          return (
            <CodeLine
              block={block}
              index={index}
              moveBlock={moveBlock}
              maxIndent={MAX_INDENT}
              draggable={true}
              key={`line-${index}`}
            />
          );
        })}
        <li
          key={'emptyField'}
          className='empty'
          style={{ background: COLORS.codeline }}
          ref={emptyLineDrop}
        />
      </ul>
    </div>
  );
}

export default SolutionField;
