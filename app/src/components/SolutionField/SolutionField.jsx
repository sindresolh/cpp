import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CodeBlock from '../CodeBlock/CodeBlock';
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
import { COLORS, X_INDENT } from '../../utils/constants';
import { useRef } from 'react';

/**
 *
 * @param {Array} codeLines    an array where each element is a block and it's indent
 * @returns a div containing the blocks players has moved to
 */
function SolutionField({}) {
  const lines = useSelector((state) => state.solutionField);
  const players = useSelector((state) => state.players);
  const emptyField = lines.length === 0;
  const dispatch = useDispatch();
  // const lineRef = useRef(null);
  // console.log(lineRef);

  // finds the block, it's index and indent based on id
  const findBlock = useCallback(
    (id) => {
      const blocks = lines.map((line) => line.block);
      const block = blocks.filter((block) => block.id === id)[0];

      if (block === undefined) return undefined; // block came from a hand list

      const blockIndex = blocks.indexOf(block);
      const indent = lines[blockIndex].indent;

      return {
        block,
        index: blockIndex,
        indent,
      };
    },
    [lines]
  );

  // move the block within the field or to a hand list
  // TODO: make sure it works with indents
  const moveBlock = useCallback(
    (id, atIndex, atIndent = 0) => {
      let updatedLines;
      let line;
      // get block if it exists in solutionfield
      const blockObj = findBlock(id);

      // update the block position in the solution field
      if (blockObj !== undefined) {
        swapBlockPositionInField(blockObj, atIndex, atIndent);
      }
      // block came from a hand
      else moveBlockFromList(id, atIndex, atIndent);

      dispatch(fieldEvent()); // Move the block for the other players
    },
    [findBlock, lines]
  );

  /**
   * Swap the position of the dragged block.
   * @param {object} blockObj     the block and it's originalindex
   * @param {number} atIndex      the new index the block was dragged into
   * @param {number} atIndent     the indent the block was dragged into
   */
  const swapBlockPositionInField = (blockObj, atIndex, atIndent) => {
    const line = {
      block: blockObj.block,
      indent: atIndent,
    };
    const updatedLines = update(lines, {
      $splice: [
        [blockObj.index, 1],
        [atIndex, 0, line],
      ],
    });

    dispatch(setFieldState(updatedLines));
  };

  /**
   * Move the dragged block from the list it came from
   * and add it to the solution field.
   * @param {string} id the id of the block that was dragged
   * @param {number} atIndex    the index it was dragged into
   * @param {number} atIndent   the indent it was dragged into
   */
  const moveBlockFromList = (id, atIndex, atIndent) => {
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
          const updatedLines = [
            ...lines.slice(0, atIndex),
            { block: movedBlock, indent: atIndent },
            ...lines.slice(atIndex),
          ];
          dispatch(setFieldState(updatedLines));
        }
      }
      handListIndex++;
    }
  };

  // blocks can be dropped into empty solution field
  const [, drop] = useDrop(
    () => ({
      accept: ItemTypes.CODEBLOCK,
      canDrop: () => emptyField,
      hover: (item, monitor) => {
        if (emptyField) {
          const handListIndex = item.player - 1;
          const handLists = store.getState().handList;
          const handList = handLists[handListIndex];
          const block = handList.filter((block) => block.id === item.id)[0];
          // only allow dropping into empty list if it's the player's block
          // TODO: indent
          dispatch(setFieldState([{ block, indent: 0 }]));
          dispatch(fieldEvent());
          dispatch(removeBlockFromList(item.id, handListIndex));
          dispatch(listEvent());
        }
      },
    }),
    [lines, emptyField]
  );

  return (
    <div
      className={'divSF'}
      ref={drop}
      style={{ background: COLORS.solutionfield }}
    >
      <h6>{'Connected platers: ' + players.length}</h6>
      <ul data-testid='solutionField'>
        {lines.map((line) => {
          let codelineColor = COLORS.codeline;
          return (
            <li
              key={line.block.id}
              data-testid='lines'
              style={{ background: codelineColor }}
              // ref={(el) => {
              //   if (!el) return;
              //   console.log(el.getBoundingClientRect());
              // }}
            >
              <CodeBlock
                {...line.block}
                blockIndent={line.indent}
                draggable={true} // TODO: might not need this
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

SolutionField.propTypes = {
  codeLines: PropTypes.array,
};

export default SolutionField;
