import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CodeBlock from '../CodeBlock/CodeBlock';
import { useCallback } from 'react';
import { useEffect } from 'react';
import { setField } from '../../redux/actions';

/**
 *
 * @param {Array} codeLines    an array where each element is a block and it's indent
 * @returns a div containing the blocks players has moved to
 */
function SolutionField({ codeLines }) {
  const lines = useSelector((state) => state.solutionField);
  const dispatch = useDispatch();

  const findBlock = useCallback(() => {
    // TODO
    return {
      block: {},
      index: 0,
    };
  }, [lines]);

  const moveBlock = useCallback(() => {
    // TODO
  }, [findBlock, lines]);

  useEffect(() => {
    dispatch(setField(codeLines));
  }, []);

  return (
    <div>
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

export default SolutionField;
