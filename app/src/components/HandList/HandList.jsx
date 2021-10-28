import React from 'react';
import CodeBlock from '../CodeBlock/CodeBlock';
import PropTypes from 'prop-types';

/**
 * This component represents a list of code blocks. Each player will have a list.
 * This list can accept dragged codeblocks if it is the correct player.
 *
 * @param {Array} codeBlocks        code blocks in the list
 * @param {Number} player           which player owns the list
 * @returns         a div containing a list of codeblocks
 */
function HandList({ codeBlocks, player }) {
  // TODO: implement droppable
  // TODO: implement reference?
  return (
    <div>
      <ul data-testid={`handList-player${player}`}>
        {codeBlocks.map((codeBlock) => {
          return (
            <li key={codeBlock.id}>
              <CodeBlock {...codeBlock} />
            </li>
          );
        })}
      </ul>
    </div>
  );
}

HandList.proptypes = {
  codeBlocks: PropTypes.array,
  player: PropTypes.number,
};

export default HandList;
