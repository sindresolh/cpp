import React from 'react';
import { COLORS } from '../../utils/constants';
import CodeBlock from '../CodeBlock/CodeBlock';
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../../utils/itemtypes';
import './CodeLine.css';

function CodeLine({ block, indent, index, moveBlock }) {
  const [, lineDrop] = useDrop(
    () => ({
      accept: ItemTypes.CODEBLOCK,
      canDrop: (item, monitor) => {
        return true; // TODO: yes for now
      },
      hover: (item, monitor) => {
        if (item.id !== block.id) moveBlock(item.id, index, indent); // move block if it is not itself
        // console.log('line');
        // let blockObj = findBlock(item.id);
        // //console.log('id', item.id, blockObj.block.id);

        // if (blockObj === undefined) {
        //   // fra hånda
        //   console.log('fra hånda');
        //   moveBlockFromList(item.id, lines.length, 0);
        // } else if (item.id !== blockObj.block.id) {
        //   // bytte plass mellom blocks i field
        //   console.log('annet id');
        //   swapBlockPositionInField(
        //     blockObj,
        //     item.originalIndex,
        //     item.originalIndent
        //   );
        // } else {
        //   console.log('samme id');
        // }

        //   if (item.id !== block.id) {
        //     console.log(item.id, block.id);
        //     moveBlock(item.id, lines.length, 0);
        //   }
        // }

        //if (draggedId !== id) {
        // const { index: overIndex, indent: overIndent } = findBlock(id);
        // moveBlock(draggedId, overIndex, overIndent);
        // if (monitor.getDifferenceFromInitialOffset().x >= OFFSET) {
        //console.log('increase indent', indent);
        // if (block.indent <= MAX_INDENT) {
        // }
        //moveBlock(item.id, block.index, block.indent + 1);
        //if (indent <= MAX_INDENT) setIndent((prevIndent) => prevIndent + 1);
        // } else if (monitor.getDifferenceFromInitialOffset().x < -OFFSET) {
        //console.log('decrease indent', indent);
        // if (block.indent > 0) {
        // }
        //moveBlock(item.id, block.index, block.indent - 1);
      },
    }),
    [block, moveBlock]
  );
  return (
    <li
      data-testid='lines'
      style={{ background: COLORS.codeline }}
      ref={lineDrop}
    >
      <CodeBlock
        {...block}
        index
        blockIndent={indent}
        draggable={true} // TODO: might not need this
      />
    </li>
  );
}

export default CodeLine;
