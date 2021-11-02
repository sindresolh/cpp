import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CodeBlock from '../CodeBlock/CodeBlock';
import { useCallback } from 'react';
import { useEffect } from 'react';

/**
 *
 * @param {Array} codeBlocks    an array where each element is a block and it's indent
 * @returns a div containing the blocks players has moved to
 */
function SolutionField({ codeBlocks }) {
  const blocks = codeBlocks; //useSelector((state) => state.solutionField);
  const dispatch = useDispatch();

  const findBlock = useCallback(() => {
    // TODO
    return {
      block: {},
      index: 0,
    };
  }, [blocks]);

  const moveBlock = useCallback(() => {
    // TODO
  }, [findBlock, blocks]);

  useEffect(() => {
    // TODO
  }, []);

  return (
    <div>
      <ul data-testid='solutionField'>
        {blocks.map((codeBlock) => {
          console.log(codeBlock.block);
          return (
            <li key={codeBlock.block.id}>
              <CodeBlock
                {...codeBlock.block}
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
