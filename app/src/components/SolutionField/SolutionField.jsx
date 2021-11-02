import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CodeBlock from '../CodeBlock/CodeBlock';
import { useCallback } from 'react';
import { useEffect } from 'react';

/**
 *
 * @param {Array} codeLines    an array where each element is a block and it's indent
 * @returns a div containing the blocks players has moved to
 */
function SolutionField({ codeLines }) {
  const lines = codeLines; //useSelector((state) => state.solutionField);
  const dispatch = useDispatch();
  console.log(lines);

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
    // TODO
  }, []);

  return (
    <div>
      <ul data-testid='solutionField'>
        {lines.map((line) => {
          console.log(line.block);
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
