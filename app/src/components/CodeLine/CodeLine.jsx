import React from 'react';
import { COLORS } from '../../utils/constants';
import CodeBlock from '../CodeBlock/CodeBlock';
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../../utils/itemtypes';
import './CodeLine.css';
import { useRef } from 'react';

const OFFSET = 50;
const MAX_INDENT = 7;

function CodeLine({ block, indent, index, moveBlock }) {
  const blockRef = useRef(null);
  const [, lineDrop] = useDrop(
    () => ({
      accept: ItemTypes.CODEBLOCK,
      canDrop: (item, monitor) => {
        return true; // TODO: yes for now
      },
      hover: (item, monitor) => {
        let dragOffset = monitor.getClientOffset().x; // get continous offset of moving (preview) block
        let blockPosition = blockRef.current.getBoundingClientRect().x; // get position of codeblock DOM
        let offsetDifference = dragOffset - blockPosition;
        const differentLine = item.id !== block.id; // swap position if block is dragged acrossed a different code line

        if (differentLine) moveBlock(item.id, index, indent);
        else if (offsetDifference > OFFSET && indent < MAX_INDENT) {
          // block is moved into the "next indent"
          console.log('flytt til høyre med indent', indent);
          moveBlock(item.id, index, indent + 1);
        } else if (offsetDifference < 0 && indent > 0) {
          // block is moved into the "previous indent"
          console.log('flytt til venstre med indent', indent);
          moveBlock(item.id, index, indent - 1);
        }
      },
    }),
    [block, moveBlock, indent]
  );
  let indentMargin = `${indent * OFFSET}px`;

  return (
    <li
      data-testid='lines'
      style={{ background: COLORS.codeline }}
      ref={lineDrop}
    >
      <div ref={blockRef} style={{ marginLeft: indentMargin }}>
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
