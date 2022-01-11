import React from 'react';
import './CodeBlock.css';
import { ItemTypes } from '../../utils/itemtypes';
import { useRef } from 'react';
import { useDrag } from 'react-dnd';
import PropTypes from 'prop-types';
import { useDrop } from 'react-dnd';

/**
 * This component represents a code block. Can be either in a player list or in a code line in the solution field.
 * This code block can be dragged into a player'shand or into the solution field.
 *
 * @param {string} id   id of the code block, e.g. 'cb-1'
 * @param {string} content   content of the code block, e.g. 'x = 1'
 * @param {number} player   the player number who owns this block
 * @param {string} category   the category, e.g. 'variable' or 'function'
 *  @param {function} moveBlock move the block to a a new position
 * @param {function} findBlock find the current position of the block
 * @param {string} placement    reference to where this block is placed (player list or in solution field)
 * @returns a draggable div containing a code block
 */
function CodeBlock({ id, content, player, category, moveBlock, findBlock, draggable }) {
  const { index: originalIndex, indent: originalIndent } = findBlock(id); // index and indent before block is moved

  // implement dragging
  const [{ isDragging }, drag] = useDrag(
    () => ({
      type: ItemTypes.CODEBLOCK,
      canDrag: draggable,
      item: { id, originalIndex, originalIndent, player },

      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),

      end: (item, monitor) => {
        const { id: droppedId, originalIndex, originalIndent } = item;
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
    [id, originalIndex, originalIndent, moveBlock]
  );

  // implement dropping
  const [, drop] = useDrop(
    () => ({
      accept: ItemTypes.CODEBLOCK,

      canDrop: () => false, // list updates on hover, not on drop
      hover({ id: draggedId }) {
        // real-time update list while dragging is happening
        if (draggedId !== id) {
          const { index: overIndex, indent: overIndent } = findBlock(id);
          moveBlock(draggedId, overIndex, overIndent);
        }
      },
    }),
    [findBlock, moveBlock]
  );

  let className = isDragging
    ? `cb ${category} player${player} dragging`
    : `cb ${category} player${player}`;

  return (
    <div
      ref={(node) => drag(drop(node))}
      data-testid={`codeBlock-player${player}`}
      id={id}
      className={className}
    >
      {draggable ? content : '        '}
    </div>
  );
}

CodeBlock.propTypes = {
  id: PropTypes.string,
  content: PropTypes.string,
  player: PropTypes.number,
  category: PropTypes.string,
  placement: PropTypes.element, // TODO: reference the element the block is in
};

export default CodeBlock;
