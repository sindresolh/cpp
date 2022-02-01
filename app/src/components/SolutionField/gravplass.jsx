// // blocks can be dropped into empty solution field
// const [, fieldDrop] = useDrop(
//   () => ({
//     accept: ItemTypes.CODEBLOCK,
//     //canDrop: () => emptyField,
//     hover: (item, monitor) => {
//       console.log('field');
//       if (lines.length === 0) {
//         moveBlock(item.id, 0, 0);
//       }
//     },
//   }),
//   [lines]
// );

// const [, lineDrop] = useDrop(
//   () => ({
//     accept: ItemTypes.CODEBLOCK,
//     canDrop: (item, monitor) => {
//       return true; // TODO: yes for now
//     },
//     hover: (item, monitor) => {
//       console.log('line');
//       let blockObj = findBlock(item.id);
//       //console.log('id', item.id, blockObj.block.id);

//       if (blockObj === undefined) {
//         // fra hånda
//         console.log('fra hånda');
//         moveBlockFromList(item.id, lines.length, 0);
//       } else if (item.id !== blockObj.block.id) {
//         // bytte plass mellom blocks i field
//         console.log('annet id');
//         swapBlockPositionInField(
//           blockObj,
//           item.originalIndex,
//           item.originalIndent
//         );
//       } else {
//         console.log('samme id');
//       }

//       //   if (item.id !== block.id) {
//       //     console.log(item.id, block.id);
//       //     moveBlock(item.id, lines.length, 0);
//       //   }
//       // }

//       //if (draggedId !== id) {
//       // const { index: overIndex, indent: overIndent } = findBlock(id);
//       // moveBlock(draggedId, overIndex, overIndent);
//       // if (monitor.getDifferenceFromInitialOffset().x >= OFFSET) {
//       //console.log('increase indent', indent);
//       // if (block.indent <= MAX_INDENT) {
//       // }
//       //moveBlock(item.id, block.index, block.indent + 1);
//       //if (indent <= MAX_INDENT) setIndent((prevIndent) => prevIndent + 1);
//       // } else if (monitor.getDifferenceFromInitialOffset().x < -OFFSET) {
//       //console.log('decrease indent', indent);
//       // if (block.indent > 0) {
//       // }
//       //moveBlock(item.id, block.index, block.indent - 1);
//     },
//   }),
//   [lines]
// );

// //console.log('update lines', line);
// let codelineColor = COLORS.codeline;
// return (
//   <li
//     key={line.block.id}
//     data-testid='lines'
//     style={{ background: codelineColor }}
//     ref={(el) => (lineDropRefs[index] = el)}
//   >
//     <CodeBlock
//       {...line.block}
//       blockIndent={line.indent}
//       draggable={true} // TODO: might not need this
//       moveBlock={moveBlock}
//       findBlock={findBlock}
//     />
//   </li>
// );
