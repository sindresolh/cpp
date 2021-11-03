import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CodeBlock from '../CodeBlock/CodeBlock';
import { useCallback } from 'react';
import { useEffect } from 'react';
import { setField, removeBlockFromList } from '../../redux/actions';
import update from 'immutability-helper';
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../../utils/itemtypes';
import PropTypes from 'prop-types';
import './SolutionField.css';
import store from '../../redux/store/store';

/**
 *
 * @param {Array} codeLines    an array where each element is a block and it's indent
 * @returns a div containing the blocks players has moved to
 */
function SolutionField({ codeLines }) {
  const lines = useSelector((state) => state.solutionField);
  const dispatch = useDispatch();

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
    (id, atIndex, atIndent = 0, playerNo) => {
      let updatedLines;
      let line;
      // get block if it exists in solutionfield
      const blockObj = findBlock(id);

      // update the block position in the solution field
      if (blockObj !== undefined) {
        line = {
          block: blockObj.block,
          indent: atIndent,
        };
        updatedLines = update(lines, {
          $splice: [
            [blockObj.index, 1],
            [atIndex, 0, line],
          ],
        });

        dispatch(setField(updatedLines));

        // block came from a hand
      } else {
        const handLists = store.getState().handList;
        let blockIsNotFound = true;
        let handListIndex = 0;
        let movedBlock;
        const AMOUNT_OF_PLAYERS = 4;

        // find block and update the correct hand list
        while (blockIsNotFound && handListIndex < AMOUNT_OF_PLAYERS) {
          for (
            let block = 0;
            block < handLists[handListIndex].length;
            block++
          ) {
            if (handLists[handListIndex][block].id === id) {
              // block is found, stop looking
              blockIsNotFound = false;
              movedBlock = handLists[handListIndex][block];
              dispatch(removeBlockFromList(id, handListIndex));
              updatedLines = [
                ...lines.slice(0, atIndex),
                { block: movedBlock, indent: atIndent },
                ...lines.slice(atIndex),
              ];
              dispatch(setField(updatedLines));
            }
          }
          handListIndex++;
        }
      }
    },
    [findBlock, lines]
  );

  // only set field on initial render. might not be ideal -H
  useEffect(() => {
    dispatch(setField(codeLines));
  }, []);

  // blocks can be dropped into solution field
  const [, drop] = useDrop(() => ({ accept: ItemTypes.CODEBLOCK }));

  return (
    <div className={'divSF'} ref={drop}>
      <h6>solution field</h6>
      <ul data-testid='solutionField'>
        {lines.map((line) => {
          return (
            <li key={line.block.id}>
              <CodeBlock
                {...line.block}
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
