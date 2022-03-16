import React, { useCallback, useEffect } from 'react';
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
} from '../../../redux/actions';
import update from 'immutability-helper';
import { ItemTypes } from '../../../utils/itemtypes';
import { useDrop } from 'react-dnd';
import store from '../../../redux/store/store';
import CodeLine from '../CodeLine/CodeLine';
import {
  moveBlockInHandList,
  requestMove,
} from '../../../utils/moveBlock/moveBlock';

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

  // update the position of the block when moved inside a list
  const moveBlock = useCallback(
    (id, atIndex, atIndent = 0) => {
      if (iAmHost()) {
        // do move locally
        moveBlockInHandList(
          id,
          atIndex,
          store.getState().solutionField,
          blocks,
          handListIndex,
          dispatch_listEvent,
          dispatch_setList,
          dispatch_removeBlockFromField,
          dispatch_fieldEvent
        );
      } else {
        // request move to host
        const move = {
          id,
          index: atIndex,
          indent: atIndent,
          field: player.toString(),
        };
        requestMove(
          move,
          store.getState().lastMoveRequest,
          dispatch_moveRequest
        );
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
    if (e.detail > 1 && draggable && movedBlock != null) {
      // (e.detauil > 1) if clicked more than once
      if (iAmHost()) {
        dispatch(removeBlockFromList(movedBlock.id, movedBlock.player - 1));
        dispatch(addBlockToField(movedBlock));
        fieldEventPromise().then(() => dispatch(listEvent()));
      } else {
        requestMove(
          movedBlock.id,
          store.getState().solutionField.length + 1,
          0,
          'SF'
        );
      }

      e.detail = 0; // resets detail so that other codeblocks can be clicked
    }
  };

  return (
    <div className={'divHL'} ref={emptyListDrop} key={draggable}>
      <ul data-testid={`handList-player${player}`}>
        {blocks.map((block, index) => {
          return (
            <CodeLine
              block={block}
              index={index}
              moveBlock={moveBlock}
              maxIndent={0}
              draggable={draggable}
              key={`player-${player}-line-${index}`}
              handleDoubbleClick={handleDoubbleClick}
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
