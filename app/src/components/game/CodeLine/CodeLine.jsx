import React, { useState, useRef, useEffect } from 'react';
import { COLORS } from '../../../utils/constants';
import CodeBlock from '../CodeBlock/CodeBlock';
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../../../utils/itemtypes';
import './CodeLine.css';
import { OFFSET } from '../../../utils/constants';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import PlayerLineIndicator from '../Player/PlayerIndicator/PlayerLineIndicator';

/**
 * A line which contains a code block. Can either be in a hand or in the solution field.
 * This component also contains a reference to a <div> surrounding the CodeBlock element.
 * This allows to get the position of the DOM in order to check the offset when dragging
 * the code block.
 *
 * @param {object} block contains information about a code block
 * @param {number} index the index of this code line
 * @param {Function} moveBlock callback function to move the block
 * @param {Function} handleDoubleclick callback function to move the block with click event
 *  @param {Function} unselectOnHover callback to set the selected block to be null
 * @param {number} maxIndent  the max indent a block can have
 * @param {boolean} draggable whether the player shall be able to drag the block or not
 * @param {int} selectedCodeline information about the currently selected codeline. This could be this codeline.
 * @returns CodeLine component
 */
function CodeLine({
  block,
  index,
  moveBlock,
  maxIndent,
  draggable,
  handleDoubbleClick,
  selectedCodeline,
  isAlwaysVisible, // Should be visible even if it is not draggable - Special case for a lock
  background,
  removedSelected,
  allSelectedLines
}) {
  const blockRef = useRef(null); // reference to get the position of the DOM element
  const [border, setBorder] = useState('none');
  const MAX_INDENT = maxIndent;
  const [selectedPlayer, setSelectedPlayer] = useState(-1);
  const [, lineDrop] = useDrop(
    () => ({
      accept: ItemTypes.CODEBLOCK,
      canDrop: (item, monitor) => {
        //Get my index if I am in solutionField
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
  
  /**
   * Notify solutionField when a selected block was removed from field
   */
  useEffect(() => {
        return () => {
          if(allSelectedLines){
            let player = allSelectedLines.findIndex(checkIndex); // Player that has selected this index
            if(player > -1) removedSelected(player);
          }
        }
    }, [])
  
  /**
   * Sets a border on selected codelines.
   * For visual aid.
   */
  useEffect(() => {
    if (selectedCodeline && selectedCodeline.id === block.id) {
      setBorder('solid #c2c2c2 0.1em');
    } else {
      setBorder('none');
    }
  }, [selectedCodeline]);

  /**
   * Check where in the array the index is stored
   * 
   * @param {*} i 
   * @returns 
   */
  function checkIndex(i) {
    return i === index;
  }

    /**
   * Sets a border on selected codelines.
   * For visual aid.
   */
  useEffect(() => {
    if(allSelectedLines != null){
      let player = allSelectedLines.findIndex(checkIndex); // Player that has selected this index
      setSelectedPlayer(player + 1);
      console.log(allSelectedLines)
    } 
  }, [allSelectedLines]);

  return (
    <li
      data-testid='codeline'
      style={{ background: background, border: border }}
      ref={lineDrop}
      key={draggable}
    >
      <PlayerLineIndicator player={selectedPlayer}/>

      <hr style={{ width: `${block.indent * OFFSET}px`,  borderTop: draggable? '0.1em solid #c2c2c2' : '0.1em solid black'}} />
      <div
        id={`blockref-${block.id}`}
        data-testid={`blockref-${block.id}`}
        ref={blockRef}
        style={{ marginLeft: `${block.indent * OFFSET}px` }}
        onClick={(e) => handleDoubbleClick(e, block, draggable, index)}
      >
        <CodeBlock {...block} index={index} draggable={ draggable} isAlwaysVisible={isAlwaysVisible} inField={maxIndent > 0} />
      </div>
    </li>
  );
}

CodeLine.propTypes = {
  block: PropTypes.object,
  index: PropTypes.number,
  moveBlock: PropTypes.func,
  unSelectOnHover: PropTypes.func,
  maxIndent: PropTypes.number,
  draggable: PropTypes.bool,
  allSelectedLines: PropTypes.array
};

export default CodeLine;
