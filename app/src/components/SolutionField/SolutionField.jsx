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

const OFFSET = 30;
const MAX_INDENT = 7; // TODO: random value for now

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
        console.log('swap');
      }
      // block came from a hand
      else {
        moveBlockFromList(id, atIndex, atIndent);
        console.log('move from list');
      }
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
    //console.log('swap pos', line);
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

  // // blocks can be dropped into empty solution field
  // const [, fieldDrop] = useDrop(
  //   () => ({
  //     accept: ItemTypes.CODEBLOCK,
  //     //canDrop: () => emptyField,
  //     hover: (item, monitor) => {
  //       console.log('field');
  //       if (lines.length === 0) {
  //         moveBlock(item.id, 0, 0);
  //       }
  //     },
  //   }),
  //   [lines]
  // );

  const [, lineDrop] = useDrop(
    () => ({
      accept: ItemTypes.CODEBLOCK,
      canDrop: (item, monitor) => {
        return true; // TODO: yes for now
      },
      hover: (item, monitor) => {
        console.log('line');
        let block = findBlock(item.id);
        if (block === undefined) {
          console.log('fra hånda');
          moveBlock(item.id, lines.length, 0);
        }
        //   if (item.id !== block.id) {
        //     console.log(item.id, block.id);
        //     moveBlock(item.id, lines.length, 0);
        //   }
        // }

        //if (draggedId !== id) {
        // const { index: overIndex, indent: overIndent } = findBlock(id);
        // moveBlock(draggedId, overIndex, overIndent);
        // if (monitor.getDifferenceFromInitialOffset().x >= OFFSET) {
        //console.log('increase indent', indent);
        // if (block.indent <= MAX_INDENT) {
        // }
        //moveBlock(item.id, block.index, block.indent + 1);
        //if (indent <= MAX_INDENT) setIndent((prevIndent) => prevIndent + 1);
        // } else if (monitor.getDifferenceFromInitialOffset().x < -OFFSET) {
        //console.log('decrease indent', indent);
        // if (block.indent > 0) {
        // }
        //moveBlock(item.id, block.index, block.indent - 1);
      },
    }),
    [lines]
  );

  const [, emptyLineDrop] = useDrop(
    () => ({
      accept: ItemTypes.CODEBLOCK,
      canDrop: (item, monitor) => {
        return true; // TODO: yes for now
      },
      hover: (item, monitor) => {
        console.log('empty');
        moveBlock(item.id, lines.length, 0);
      },
    }),
    [lines]
  );

  return (
    <div className={'divSF'} style={{ background: COLORS.solutionfield }}>
      <h6>{'Connected platers: ' + players.length}</h6>
      <ul data-testid='solutionField'>
        {lines.map((line) => {
          //console.log('update lines', line);
          let codelineColor = COLORS.codeline;
          return (
            <li
              key={line.block.id}
              data-testid='lines'
              style={{ background: codelineColor }}
              ref={lineDrop}
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
        <li
          className='empty'
          style={{ background: COLORS.codeline }}
          ref={emptyLineDrop}
        />
      </ul>
    </div>
  );
}

SolutionField.propTypes = {
  codeLines: PropTypes.array,
};

export default SolutionField;
