import React from 'react';
import { COLORS } from '../../../utils/constants';
import CodeBlock from '../CodeBlock/CodeBlock';
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../../../utils/itemtypes';
import './CodeLine.css';
import { useRef } from 'react';
import { OFFSET } from '../../../utils/constants';
import PropTypes from 'prop-types';

/**
 * A line which contains a code block. Can either be in a hand or in the solution field.
 * This component also contains a reference to a <div> surrounding the CodeBlock element.
 * This allows to get the position of the DOM in order to check the offset when dragging
 * the code block.
 *
 * @param {object} block contains information about a code block
 * @param {number} index the index of this code line
 * @param {Function} moveBlock callback function to move the block
 * @param {number} maxIndent  the max indent a block can have
 * @param {boolean} draggable whether the player shall be able to drag the block or not
 * @returns CodeLine component
 */
function CodeLine({ block, index, moveBlock, maxIndent, draggable }) {
  const blockRef = useRef(null); // reference to get the position of the DOM element
  const MAX_INDENT = maxIndent;
  const [, lineDrop] = useDrop(
    () => ({
      accept: ItemTypes.CODEBLOCK,
      canDrop: (item, monitor) => {
        return true; // TODO: yes for now
      },
      hover: (item, monitor) => {
        const dragOffset = monitor.getSourceClientOffset().x; // get continous offset of moving (preview) block
        const blockPosition = blockRef.current.getBoundingClientRect().x; // get position of codeblock DOM
        const offsetDifference = dragOffset - blockPosition; // check if a block is dragged over its "indent boundary"
        const differentLine = item.id !== block.id; // swap position if block is dragged acrossed a different code line
        const indent = block.indent;

        if (differentLine) moveBlock(item.id, index, indent);
        else if (offsetDifference > OFFSET && indent < MAX_INDENT)
          moveBlock(item.id, index, indent + 1);
        // increase indent if the offset exceeds the threshold AND the solution field allows increasing indent
        else if (offsetDifference < 0 && indent > 0)
          moveBlock(item.id, index, indent - 1); // block is moved to the previous indent
      },
    }),
    [block, moveBlock]
  );

  return (
    <li
      data-testid='codeline'
      style={{ background: COLORS.codeline }}
      ref={lineDrop}
      key={draggable}
    >
      <div
        id={`blockref-${block.id}`}
        data-testid={`blockref-${block.id}`}
        ref={blockRef}
        style={{ marginLeft: `${block.indent * OFFSET}px` }}
      >
        <CodeBlock {...block} index={index} draggable={draggable} />
      </div>
    </li>
  );
}

CodeLine.propTypes = {
  block: PropTypes.object,
  index: PropTypes.number,
  moveBlock: PropTypes.func,
  maxIndent: PropTypes.number,
  draggable: PropTypes.bool,
};

export default CodeLine;
