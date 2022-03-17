import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import CodeLine from '../CodeLine/CodeLine';
import { useCallback, useEffect, useState } from 'react';
import {
  setFieldState,
  removeBlockFromList,
  fieldEvent,
  listEvent,
  removeBlockFromField,
  addBlockToList,
  moveRequest,
} from '../../../redux/actions';
import update from 'immutability-helper';
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../../../utils/itemtypes';
import './SolutionField.css';
import store from '../../../redux/store/store';
import { COLORS, MAX_INDENT, KEYBOARD_EVENT } from '../../../utils/constants';
import { objectIsEqual } from '../../../utils/compareArrays/compareArrays';

/**
 * Check if a move is already been requested to the host.
 * This prevents sending the same request repeatedly while hovering.
 * @param {object} move
 * @param {object} lastMoveRequest
 * @returns true if the move has been requested
 */
const alreadyRequested = (move, lastMoveRequest) => {
  if (
    move.id !== lastMoveRequest.id ||
    move.index !== lastMoveRequest.index ||
    move.indent !== lastMoveRequest.indent ||
    move.field !== lastMoveRequest.field
  )
    return false;
  return true;
};

/**
 * @returns true if this player is the host.
 */
const iAmHost = () => {
  return store.getState().host === '';
};

/**
 * The field the players can move blocks into.
 * The field contains codelines which allows indenting of blocks, as well as
 * swapping positions by dragging.
 *
 * @returns a div containing the blocks players has moved blocks into
 */
function SolutionField({}) {
  const currentTaskNumber = useSelector(
    (state) => state.currentTask.currentTaskNumber
  );
  const blocks = useSelector((state) => state.solutionField);
  const players = useSelector((state) => state.players);
  const dispatch = useDispatch();
  const [selectedCodeline, setSelectedCodeline] = useState(null); // block selected for the next keyDown event
  const newLockEvent = useSelector((state) => state.lockEvent); // Keeps track of new lock events
  const [locked, setLocked] = useState(false);

  // finds the block, it's index and indent based on id
  const findBlock = useCallback(
    (id) => {
      const block = blocks.filter((block) => block.id === id)[0];
      if (block === undefined) return undefined; // block came from a hand list
      const blockIndex = blocks.indexOf(block);

      return {
        block,
        index: blockIndex,
      };
    },
    [blocks]
  );

  // move the block within the field or to a hand list
  const moveBlock = useCallback(
    (id, atIndex, atIndent = 0, mouseEvent = true) => {
      if (mouseEvent) {
        setSelectedCodeline(null); // reset selected codeblocks
      }
      // get block if it exists in solutionfield
      if (iAmHost()) {
        // perform move locally before dispatching field event
        const block = findBlock(id);
        if (block === undefined) {
          // block does not exist in field, get from hand
          moveBlockFromList(id, atIndex);
        } else {
          // block came from the field, swap position
          swapBlockPositionInField(block, atIndex, atIndent);
        }
        dispatch(fieldEvent()); // Move the block for the other players
      } else {
        requestMove(id, atIndex, atIndent, 'SF');
      }
    },
    [findBlock, blocks]
  );

  /**
   * Request a move to the host.
   * @param {*} id
   * @param {*} index
   * @param {*} indent
   */
  const requestMove = (id, index, indent, field) => {
    const move = {
      id,
      index,
      indent,
      field,
    };
    const lastMoveRequest = store.getState().moveRequest;
    if (!alreadyRequested(move, lastMoveRequest)) dispatch(moveRequest(move));
  };

  /**
   * Handle keyboard input for the selected codeblock.
   * Tab and bacskpace changes indenting.
   */
  const handleKeyDown = useCallback((e) => {
    e.preventDefault(); // do not target adress bar
    if (
      selectedCodeline != null &&
      findBlock(selectedCodeline.id) !== undefined &&
      e.keyCode != null
    ) {
      if (
        (e.shiftKey &&
          e.keyCode == KEYBOARD_EVENT.TAB &&
          selectedCodeline.indent > 0) ||
        (e.keyCode === KEYBOARD_EVENT.BACKSPACE && selectedCodeline.indent > 0)
      ) {
        // SHIFT TAB OR BACKSPACE
        setSelectedCodeline((selectedCodeline) => ({
          ...selectedCodeline,
          indent: selectedCodeline.indent - 1,
        }));
        moveBlock(
          selectedCodeline.id,
          selectedCodeline.index,
          selectedCodeline.indent - 1,
          false
        );
      } else if (
        !e.shiftKey &&
        e.keyCode === KEYBOARD_EVENT.TAB &&
        selectedCodeline.indent < MAX_INDENT
      ) {
        // TAB
        setSelectedCodeline((selectedCodeline) => ({
          ...selectedCodeline,
          indent: selectedCodeline.indent + 1,
        }));
        moveBlock(
          selectedCodeline.id,
          selectedCodeline.index,
          selectedCodeline.indent + 1,
          false
        );
      }
    }
  });

  /* Reset selected block when a new task starts*/
  useEffect(() => {
    setSelectedCodeline(null);
  }, [currentTaskNumber]);

   /**
   * Another player has changed their ready status
   */
  useEffect(() => {
    let players = store.getState().players;
    for (let p of players) {
      if (!p.hasOwnProperty('lock')) {
        p.lock = false;
      }
      if (p.id === 'YOU') {
        setLocked(p.lock);
      }

    }
  }, [newLockEvent]);

  /**
   * Creates an key event listener based on the selected codeblock
   * If it is me: Lock my board
   */
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  /**
   * Swap the position of the dragged block.
   * @param {object} blockObj     the block and it's originalindex
   * @param {number} atIndex      the new index the block was dragged into
   * @param {number} atIndent     the indent the block was dragged into
   */
  const swapBlockPositionInField = (blockObj, atIndex, atIndent) => {
    let block = blockObj.block;
    block.indent = atIndent;
    const updatedBlocks = update(blocks, {
      $splice: [
        [blockObj.index, 1],
        [atIndex, 0, block],
      ],
    });

    dispatch(setFieldState(updatedBlocks));
  };

  /**
   * Move the dragged block from the list it came from
   * and add it to the solution field.
   * @param {string} id the id of the block that was dragged
   * @param {number} atIndex    the index it was dragged into
   */
  const moveBlockFromList = (id, atIndex) => {
    const handLists = store.getState().handList;
    let blockIsNotFound = true;
    let handListIndex = 0;
    let movedBlock;
    const AMOUNT_OF_PLAYERS = 4;

    // find block and update the correct hand list
    while (blockIsNotFound && handListIndex < AMOUNT_OF_PLAYERS) {
      for (let block = 0; block < handLists[handListIndex].length; block++) {
        if (handLists[handListIndex][block].id === id) {
          // block is found, stop looking
          blockIsNotFound = false;
          movedBlock = handLists[handListIndex][block];
          dispatch(removeBlockFromList(id, handListIndex));
          dispatch(listEvent());
          const updatedBlocks = [
            ...blocks.slice(0, atIndex),
            movedBlock,
            ...blocks.slice(atIndex),
          ];
          dispatch(setFieldState(updatedBlocks));
        }
      }
      handListIndex++;
    }
  };

  const [, emptyLineDrop] = useDrop(
    () => ({
      accept: ItemTypes.CODEBLOCK,
      hover: (item, monitor) => {
        moveBlock(item.id, blocks.length, 0); // only allow drop in empty field if it comes from hand
      },
    }),
    [blocks]
  );

  /** Helper function to make sure that the field event is done before sending a new event
   *
   * @returns
   */
  const fieldEventPromise = () => {
    return Promise.resolve(dispatch(fieldEvent()));
  };

  /** Moves block from solutionfield to hand after a doubbleclick
   *
   * @param {*} e
   * @param {*} movedBlock : codeblock moved
   * @param {*} draggable : wheter or not the player has permission to perform this action
   */
  const handleDoubbleClick = (e, movedBlock, draggable, index) => {
    if(!locked){
      setSelectedCodeline(movedBlock);
      if (movedBlock != null && draggable) {
        // the user selected this codeblock
        movedBlock.index = index;
      }
      // (e.detauil > 1) if clicked more than once
      if (e.detail > 1) {
        if (iAmHost()) {
          movedBlock.indent = 0;
          dispatch(removeBlockFromField(movedBlock.id));
          dispatch(addBlockToList(movedBlock));
          fieldEventPromise().then(() => dispatch(listEvent()));
        } else {
          const blockOwner = movedBlock.player;
          const listIndex = blockOwner - 1;
          const atIndex = store.getState().handList[listIndex].length;
          requestMove(movedBlock.id, atIndex, 0, blockOwner);
        }
      }
    }
    e.detail = 0; // resets detail so that other codeblocks can be clicked
    
  };

  return (
    <div className={'divSF'} style={{ background: COLORS.solutionfield }}>
      <h6>{'Connected players: ' + players.length}</h6>
      <ul data-testid='solutionField'>
        {blocks.map((block, index) => {
          return (
            <CodeLine
              block={block}
              index={index}
              moveBlock={moveBlock}
              maxIndent={MAX_INDENT}
              draggable={!locked}
              key={`line-${index}`}
              handleDoubbleClick={handleDoubbleClick}
              selectedCodeline={selectedCodeline}
              isAlwaysVisible={true}
            />
          );
        })}
        <li
          key={'emptyField'}
          className='empty'
          style={{ background: COLORS.codeline }}
          ref={emptyLineDrop}
        />
      </ul>
    </div>
  );
}

export default SolutionField;
