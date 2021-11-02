import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CodeBlock from '../CodeBlock/CodeBlock';
import { useCallback } from 'react';
import { useEffect } from 'react';
import { setField } from '../../redux/actions';
import update from 'immutability-helper';
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../../utils/itemtypes';
import PropTypes from 'prop-types';
import './SolutionField.css';

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

  // update the position of the block when moved
  // TODO: implement block moved from solution field and vice versa
  const moveBlock = useCallback(
    // TODO: make sure it works with indents
    (id, atIndex, atIndent = 0) => {
      const { block, index, indent } = findBlock(id);
      const line = {
        block: block,
        indent: atIndent,
      };
      const updatedLines = update(lines, {
        $splice: [
          [index, 1],
          [atIndex, 0, line],
        ],
      });
      dispatch(setField(updatedLines));
    },
    [findBlock, lines]
  );

  useEffect(() => {
    dispatch(setField(codeLines));
  }, []);

  // blocks can be dropped into solution field
  const [, drop] = useDrop(() => ({ accept: ItemTypes.CODEBLOCK }));

  return (
    <div className={'divSF'} ref={drop}>
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
