// implement dropping
// const [, drop] = useDrop(
//   () => ({
//     accept: ItemTypes.CODEBLOCK,

//     canDrop: () => false, // list updates on hover, not on drop
//     hover({ id: draggedId }, monitor) {
//       // // real-time update list while dragging is happening
//       // //console.log(monitor.getDifferenceFromInitialOffset().x);
//       // const { index: overIndex, indent: overIndent } = findBlock(id);
//       // if (draggedId !== id) {
//       //   moveBlock(draggedId, overIndex, overIndent);
//       // } else if (monitor.getDifferenceFromInitialOffset().x >= OFFSET) {
//       //   //console.log('mer enn 30 wow', indent);
//       //   if (blockIndent <= MAX_INDENT)
//       //     moveBlock(id, overIndex, blockIndent + 1);
//       // } else if (monitor.getDifferenceFromInitialOffset().x < -OFFSET) {
//       //   //console.log('mindre enn 30');
//       //   if (blockIndent > 0) moveBlock(id, overIndex, blockIndent - 1);
//       // }
//     },
//   }),
//   [findBlock, moveBlock, blockIndent]
// );
