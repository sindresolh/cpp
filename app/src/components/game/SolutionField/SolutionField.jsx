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
  selectRequest
} from '../../../redux/actions';
import { useDrop } from 'react-dnd';
import { ItemTypes } from '../../../utils/itemtypes';
import './SolutionField.css';
import store from '../../../redux/store/store';
import { COLORS, MAX_INDENT, KEYBOARD_EVENT } from '../../../utils/constants';
import {
  moveBlockInSolutionField,
  requestMove,
} from '../../../utils/moveBlock/moveBlock';
import { getLock } from '../../../utils/lockHelper/lockHelper';
import BigLockImage from '../../../utils/images/buttonIcons/biglock.png'

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
function SolutionField({minwidth}) {
  const currentTaskNumber = useSelector(
    (state) => state.currentTask.currentTaskNumber
  );
  const blocks = useSelector((state) => state.solutionField);
  const players = useSelector((state) => state.players);
  const dispatch = useDispatch();
  const [selectedCodeline, setSelectedCodeline] = useState(null); // block selected for the next keyDown event
  const newLockEvent = useSelector((state) => state.lockEvent); // Keeps track of new lock events
  const [locked, setLocked] = useState(false);

  const dispatch_fieldEvent = () => {
    dispatch(fieldEvent());
  };

  const dispatch_listEvent = () => {
    dispatch(listEvent());
  };

  const dispatch_setFieldState = (blocks) => {
    dispatch(setFieldState(blocks));
  };

  const dispatch_removeBlockFromList = (id, handListIndex) => {
    dispatch(removeBlockFromList(id, handListIndex));
  };

  const dispatch_moveRequest = (move) => {
    dispatch(moveRequest(move));
  };

  // dispatch functions to be passed as parameters in moveblock
  const dispatches = {
    dispatch_fieldEvent,
    dispatch_listEvent,
    dispatch_setFieldState,
    dispatch_removeBlockFromList,
    dispatch_moveRequest,
  };

  // move the block within the field or to a hand list
  const moveBlock = useCallback(
    (id, atIndex, atIndent = 0, mouseEvent = true) => {
      // get block if it exists in solutionfield
      if (iAmHost()) {
        moveBlockInSolutionField(
          id,
          atIndex,
          atIndent,
          blocks,
          store.getState().handList,
          dispatches
        );
      } else {
        const move = { id, index: atIndex, indent: atIndent, field: 'SF' };
        requestMove(move, store.getState().moveRequest, dispatch_moveRequest);
      }
    },
    [blocks]
  );

  /**
   * Handle keyboard input for the selected codeblock.
   * Tab and bacskpace changes indenting.
   */
  const handleKeyDown = useCallback((e) => {
    if(!locked){
      const block = blocks.filter((block) => block.id === selectedCodeline.id)[0];
      const blockExists = block !== undefined;
      e.preventDefault(); // do not target adress bar
      if (selectedCodeline != null && blockExists && e.keyCode != null) {
      if (
        (e.shiftKey &&
          e.keyCode == KEYBOARD_EVENT.TAB &&
          selectedCodeline.indent > 0) ||
        (e.keyCode === KEYBOARD_EVENT.BACKSPACE && selectedCodeline.indent > 0)
      ) {
        // SHIFT TAB OR BACKSPACE
        let newSelectedCodeline = {
          ...selectedCodeline,
          indent: selectedCodeline.indent - 1,
        }
        if(store.getState().selectRequest !== selectedCodeline){
          dispatch(selectRequest(newSelectedCodeline));
        } 
        setSelectedCodeline((newSelectedCodeline));

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
        let newSelectedCodeline ={
         ...selectedCodeline,
          indent: selectedCodeline.indent + 1,
        }
        if(store.getState().selectRequest !== selectedCodeline){
          dispatch(selectRequest(newSelectedCodeline));
        } 
        setSelectedCodeline(newSelectedCodeline);
        moveBlock(
          selectedCodeline.id,
          selectedCodeline.index,
          selectedCodeline.indent + 1,
          false
        );
      }
    }

    }
    
  });

  /* Reset selected block when a new task starts*/
  useEffect(() => {
    setSelectedCodeline(null);
    dispatch(selectRequest(null));
  }, [currentTaskNumber]);

   /**
   * Another player has changed their ready status
   */
  useEffect(() => {
      let players = store.getState().players;
      let myLock = getLock(players, 'YOU');
      if(myLock !== locked){
        setLocked(myLock);
        if(store.getState().selectRequest !== selectedCodeline){
          dispatch(selectRequest(null));
        } 
        setSelectedCodeline(null);
        
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
       if(store.getState().selectRequest !== selectedCodeline){
          dispatch(selectRequest(movedBlock));
       } 
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
        const playerField = movedBlock.player.toString();
        const listIndex = movedBlock.player - 1;
        const atIndex = store.getState().handList[listIndex].length;
        const move = {
          id: movedBlock.id,
          index: atIndex,
          indent: 0,
          field: playerField,
        };
        requestMove(move, store.getState().moveRequest, dispatch_moveRequest);
        }
      }
    }
    e.detail = 0; // resets detail so that other codeblocks can be clicked
  };

  /**
   * A new codeline is dragged by me. Make sure it it selected.
   * 
   * @param {*} block 
   * @param {*} draggable 
   * @param {*} index 
   */
  const handleDrag = (movedBlock, draggable, index) =>{
    if(!locked){
      if(store.getState().selectRequest !== selectedCodeline){
        dispatch(selectRequest(movedBlock));
       } 
      setSelectedCodeline(movedBlock);
      
      if (movedBlock != null && draggable) {
      // the user selected this codeblock
      movedBlock.index = index;
    }
    }
  }

  return (
    <div className={'divSF'} style={{ background: locked ? "#C2C2C2" : COLORS.solutionfield }}>
      <h6>{'Connected players: ' + players.length}</h6>
      {locked && minwidth? <div className='bigLockContainer'><img draggable={false} className="bigLock" src={BigLockImage} /> </div> :''}
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
              handleDrag={handleDrag}
              selectedCodeline={selectedCodeline}
              isAlwaysVisible={true}
              background={!locked? COLORS.codeline : COLORS.grey}
            />
          );
        })}
        <li
          key={'emptyField'}
          className='empty'
          style={{ background: COLORS.codeline, visibility: locked? 'hidden' : 'visible' }}
          ref={emptyLineDrop}
        />
      </ul>
    </div>
  );
}

export default SolutionField;
