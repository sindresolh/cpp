import React from 'react';
import './CodeBlock.css';
import { ItemTypes } from '../../../utils/itemtypes';
import { useDrag } from 'react-dnd';
import PropTypes from 'prop-types';

/**
 * This component represents a code block. Can be either in a player list or in a code line in the solution field.
 * This code block can be dragged into a player'shand or into the solution field.
 *
 * @param {string} id   id of the code block, e.g. 'cb-1'
 * @param {string} code   code of the code block, e.g. 'x = 1'
 * @param {number} player   the player number who owns this block
 * @param {string} category   the category, e.g. 'variable' or 'function'
 * @param {number} indent   what indent the block is in
 * @param {number} index  what index the codeblock is at
 *  @param {function} moveBlock move the block to a a new position
 * @param {function} findBlock find the current position of the block
 * @returns a draggable div containing a code block
 */
function CodeBlock({
  id,
  code,
  player,
  category,
  indent,
  index,
  moveBlock,
  draggable,
}) {
  // implement dragging
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.CODEBLOCK,
      canDrag: draggable,
      item: {
        id,
        index,
        indent,
        player,
      },
      isDragging(monitor) {
        return id === monitor.getItem().id;
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      end: (item, monitor) => {
        //const { id: droppedId, originalIndex, originalIndent } = item;
        const didDrop = monitor.didDrop();

        if (!didDrop) {
          // TODO: move block back to original position if dropped outside of a droppable zone
          // commented out due to a bug with multiple players.
          // We can fix this later if we get time. It's a nice-to-have feature at best. Removing it does not break functionality in any way
          /*
          moveBlock(droppedId, originalIndex, originalIndent, true, player - 1);
          */
        }
      },
    }),
    [id, index, indent, moveBlock]
  );

  let className = isDragging
    ? `cb ${category} player${player} dragging`
    : `cb ${category} player${player}`;
  className = !draggable ? className + ' invisible' : className;

  return (
    <div 
      ref={drag}
      data-testid={`codeBlock-player${player}`}
      id={id}
      className={className}
      key={`block-${id}`}
    >
      <code class="python">
        {code}
      </code>
    </div>
  );
}

CodeBlock.propTypes = {
  id: PropTypes.string,
  code: PropTypes.string,
  player: PropTypes.number,
  category: PropTypes.string,
  indent: PropTypes.number,
  index: PropTypes.number,
  moveBlock: PropTypes.func,
  draggable: PropTypes.bool,
};

export default CodeBlock;
