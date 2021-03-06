import React, { useCallback, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import './HandList.css';
import { useSelector, useDispatch } from 'react-redux';
import {
  setList,
  removeBlockFromField,
  listEvent,
  fieldEvent,
  moveRequest,
  removeBlockFromList,
  addBlockToField,
  setPlayers,
  selectEvent,
  selectRequest,
} from '../../../redux/actions';
import { ItemTypes } from '../../../utils/itemtypes';
import { useDrop } from 'react-dnd';
import store from '../../../redux/store/store';
import CodeLine from '../CodeLine/CodeLine';
import {
  moveBlockInHandList,
  requestMove,
} from '../../../utils/moveBlock/moveBlock';
import { getLock } from '../../../utils/lockHelper/lockHelper';
import { COLORS } from '../../../utils/constants';
import { setSelected} from '../../../utils/lockHelper/lockHelper';

/**
 * @returns true if this player is the host.
 */
const iAmHost = () => {
  return store.getState().host === '';
};

/**
 * This component represents a list of code blocks. Each player will have a list.
 * This list can accept dragged codeblocks if it is the correct player.
 *
 * @param {Number} player    which player owns the list
 * @param {Boolean} draggable   whether the player (the client) is allowed to drag the blocks in this list
 * @returns a div containing a list of codeblocks
 */
function HandList({ player, draggable }) {
  const dispatch = useDispatch();
  const handListIndex = player - 1;
  let blocks = useSelector((state) => state.handList[handListIndex]);
  blocks = blocks.map((block) => ({ ...block, indent: 0 })); // set indent to 0
  const emptyList = blocks.length === 0;
  const newLockEvent = useSelector((state) => state.lockEvent); // Keeps track of new lock events
  const [locked, setLocked] = useState(false);

  const dispatch_listEvent = () => {
    dispatch(listEvent());
  };

  const dispatch_setList = (blocks, handListIndex) => {
    dispatch(setList(blocks, handListIndex));
  };

  const dispatch_removeBlockFromField = (id) => {
    dispatch(removeBlockFromField(id));
  };

  const dispatch_fieldEvent = () => {
    dispatch(fieldEvent());
  };

  const dispatch_moveRequest = (move) => {
    dispatch(moveRequest(move));
  };

  // dispatch functions to be passed as parameters in moveblock
  const dispatches = {
    dispatch_listEvent,
    dispatch_setList,
    dispatch_removeBlockFromField,
    dispatch_fieldEvent,
    dispatch_moveRequest,
  };

  // update the position of the block when moved inside a list
  const moveBlock = useCallback(
    (id, atIndex, atIndent = 0) => {
        // do move locally
        moveBlockInHandList(
          id,
          atIndex,
          store.getState().solutionField,
          blocks,
          handListIndex,
          dispatches
        );
      if (!iAmHost()) {
        // request move to host
        const move = {
          id,
          index: atIndex,
          indent: atIndent,
          field: player.toString(),
          timestamp: new Date().getTime()
        };
        requestMove(move, store.getState().moveRequest, dispatch_moveRequest);
      }
    },
    [blocks]
  );

  // blocks can be dropped into empty hand list
  const [, emptyListDrop] = useDrop(
    () => ({
      accept: ItemTypes.CODEBLOCK,
      canDrop: () => emptyList,
      hover: (item) => {
        if (item.player === player && emptyList) {
          moveBlock(item.id);
        }
      },
    }),
    [blocks, emptyList]
  );

  /**
   * Another player has changed their ready status
   * If it is me: Make sure that I cannot move blocks into solutionField
   */
  useEffect(() => {
      let players = store.getState().players;
      let myLock = getLock(players, 'YOU');
      if(myLock !== locked){
        setLocked(myLock);
      }
  }, [newLockEvent]);

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
  const handleDoubbleClick = (e, movedBlock, draggable) => {
    if (!locked && e.detail > 1 && draggable && movedBlock != null) {
      let index = store.getState().solutionField.length + 1;
      // (e.detauil > 1) if clicked more than once
      dispatch(removeBlockFromList(movedBlock.id, movedBlock.player - 1));
      dispatch(addBlockToField(movedBlock));
      fieldEventPromise().then(() => dispatch(listEvent()));
      if (!iAmHost()) {
        const move = {
          id: movedBlock.id,
          index: index,
          indent: 0,
          field: 'SF',
          timestamp: new Date().getTime()
        };
        requestMove(move, store.getState().moveRequest, dispatch_moveRequest);
      }

      e.detail = 0; // resets detail so that other codeblocks can be clicked
    }
  };

    /**
   * Unselect on drop
   * 
   */
  const handleDroppedLine = () => {
     if(iAmHost()){
        let players =store.getState().players;
        dispatch(setPlayers(
        setSelected(players, 'YOU', null))
        );
        dispatch(selectEvent({ pid: 'HOST', index: null }));
      }
      else {
        dispatch(selectRequest(null));
      }
    }

  return (
    <div className={'divHL'} ref={emptyListDrop} key={draggable} style={{backgroundColor: !locked? COLORS.codeline : COLORS.grey}}>
      <ul data-testid={`handList-player${player}`}>
        {blocks.map((block, index) => {
          return (
            <CodeLine
              block={block}
              index={index}
              moveBlock={moveBlock}
              maxIndent={0}
              draggable={locked? !locked : draggable}
              key={`player-${player}-line-${index}`}
              handleDoubbleClick={handleDoubbleClick}
              isAlwaysVisible={draggable}
              background={!locked? COLORS.codeline : COLORS.grey}
              handleDroppedLine={handleDroppedLine}
            />
          );
        })}
      </ul>
    </div>
  );
}

HandList.propTypes = {
  player: PropTypes.number,
  draggable: PropTypes.bool,
};

export default HandList;
