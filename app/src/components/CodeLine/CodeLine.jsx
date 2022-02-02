import React from 'react';
import { COLORS } from '../../utils/constants';
import CodeBlock from '../CodeBlock/CodeBlock';
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../../utils/itemtypes';
import './CodeLine.css';
import { useRef } from 'react';
import { OFFSET } from '../../utils/constants';

/**
 * A line which contains a code block. Can either be in a hand or in the solution field.
 * This component also contains a reference to a <div> surrounding the CodeBlock element.
 * This allows to get the position of the DOM in order to check the offset when dragging
 * the code block.
 *
 * @param {object} block contains information about a code block
 * @param {number} index the index of this code line
 * @param {function} moveBlock callback function to move the block
 * @returns CodeLine component
 */
function CodeLine({ block, indent, index, moveBlock, maxIndent }) {
  const blockRef = useRef(null); // reference to get the position of the DOM element
  const MAX_INDENT = maxIndent;
  const [, lineDrop] = useDrop(
    () => ({
      accept: ItemTypes.CODEBLOCK,
      canDrop: (item, monitor) => {
        return true; // TODO: yes for now
      },
      hover: (item, monitor) => {
        const dragOffset = monitor.getClientOffset().x; // get continous offset of moving (preview) block
        const blockPosition = blockRef.current.getBoundingClientRect().x; // get position of codeblock DOM
        const offsetDifference = dragOffset - blockPosition; // check if a block is dragged over its "indent boundary"
        const differentLine = item.id !== block.id; // swap position if block is dragged acrossed a different code line

        if (differentLine) moveBlock(item.id, index, indent);
        else if (offsetDifference > OFFSET && indent < MAX_INDENT)
          moveBlock(item.id, index, indent + 1);
        // increase indent if the offset exceeds the threshold AND the solution field allows increasing indent
        else if (offsetDifference < 0 && indent > 0)
          moveBlock(item.id, index, indent - 1); // block is moved to the previous indent
      },
    }),
    [block, moveBlock, indent]
  );

  return (
    <li
      data-testid='lines'
      style={{ background: COLORS.codeline }}
      ref={lineDrop}
    >
      <div
        id={`blockref-${block.id}`}
        ref={blockRef}
        style={{ marginLeft: `${indent * OFFSET}px` }}
      >
        <CodeBlock
          {...block}
          index
          blockIndent={indent}
          draggable={true} // TODO: might not need this
        />
      </div>
    </li>
  );
}

export default CodeLine;
