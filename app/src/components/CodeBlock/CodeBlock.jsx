import React from 'react';
import './CodeBlock.css';
import { ItemTypes } from '../../utils/itemtypes';
import { useRef } from 'react';
import { useDrag } from 'react-dnd';
import PropTypes from 'prop-types';

/**
 * This component represents a code block. Can be either in a player list or in a code line in the solution field.
 * This code block can be dragged into a player'shand or into the solution field.
 *
 * @param {string} id   id of the code block, e.g. 'cb-1'
 * @param {string} content   content of the code block, e.g. 'x = 1'
 * @param {number} player   the player number who owns this block
 * @param {string} category   the category, e.g. 'variable' or 'function'
 * @param {string} placement    reference to where this block is placed (player list or in solution field)
 * @returns a draggable div containing a code block
 */
function CodeBlock({ id, content, player, category, placement = null }) {
  const placementRef = useRef(placement);
  const [{ isDragging }, drag, dragPreview] = useDrag(() => ({
    type: ItemTypes.CODEBLOCK,
    item: { id, content, player, placement: placementRef.current },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  let className = isDragging
    ? `cb ${category} player${player} dragging`
    : `cb ${category} player${player}`;

  return (
    <div
      ref={drag}
      data-testid={`codeBlock-player${player}`}
      id={id}
      className={className}
    >
      {content}
    </div>
  );
}

CodeBlock.proptypes = {
  id: PropTypes.string,
  content: PropTypes.string,
  player: PropTypes.number,
  category: PropTypes.string,
  placement: PropTypes.element, // TODO: reference the element the block is in
};

export default CodeBlock;
