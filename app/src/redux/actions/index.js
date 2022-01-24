import { ACTIONS } from './ACTIONS';

/** Called to start the game for all connected players
 * See reducers/gameState/inProgress
 *
 * @param {*} state : boolean, is the game in progresS?
 * @returns
 */
export const startGame = (state) => {
  return {
    type: ACTIONS.START_GAME,
    payload: {
      state,
    },
  };
};

/** Called to set the handlist for a spesific player
 *
 * @param {*} blocks : array of codeblocks
 * @param {*} handListIndex : player 1 has index 0, player 2 has index 1 etc.
 * @returns
 */
export const setList = (blocks, handListIndex) => {
  return {
    type: 'SET_LIST',
    payload: {
      blocks,
      handListIndex,
    },
  };
};

export const setFieldState = (lines) => {
  return {
    type: 'SET_FIELD_STATE',
    payload: {
      lines,
    },
  };
};

export const addBlock = (block, handListIndex) => {
  return {
    type: 'ADD_BLOCK',
    payload: {
      block,
      handListIndex,
    },
  };
};

export const removeBlockFromList = (blockId, handListIndex) => {
  return {
    type: 'REMOVE_BLOCK_FROM_LIST',
    payload: {
      id: blockId,
      handListIndex,
    },
  };
};

export const removeBlockFromField = (id) => {
  return {
    type: 'REMOVE_BLOCK_FROM_FIELD',
    payload: {
      id,
    },
  };
};

export const setListState = (state) => {
  return {
    type: 'SET_LIST_STATE',
    payload: {
      state,
    },
  };
};

/** Notify other peers in CommunicationListener ComponentDidUpdate
 * The board is cleared to the initial state
 * See reducers/webrtc/clearEvent
 *
 * @param {*} state : Date when this reducer was called last time
 * @returns
 */
export const clearShoutEvent = (state) => {
  return {
    type: ACTIONS.CLEAR_EVENT,
    payload: {
      state,
    },
  };
};

/** Notify other peers in CommunicationListener ComponentDidUpdate
 * The handlist is updated
 * See reducers/webrtc/listEvent
 *
 * @param {*} state : Date when this reducer was called last time
 * @returns
 */
export const listEvent = (state) => {
  return {
    type: ACTIONS.LIST_EVENT,
    payload: {
      state,
    },
  };
};

/** Notify other peers in CommunicationListener ComponentDidUpdate
 *  The solutionfield is updated
 * See reducers/webrtc/field
 *
 * @param {*} state : Date when this reducer was called last time
 * @returns
 */
export const fieldEvent = (state) => {
  return {
    type: ACTIONS.FIELD_EVENT,
    payload: {
      state,
    },
  };
};

/** Notify other peers in CommunicationListener ComponentDidUpdate
 *  The task is updated
 * See reducers/webrtc/field
 *
 * @param {*} state : Date when this reducer was called last time
 * @returns
 */
export const taskEvent = (state) => {
  return {
    type: ACTIONS.TASK_EVENT,
    payload: {
      state,
    },
  };
};

export const nextTask = (state) => {
  return {
    type: 'NEXT_TASK',
    payload: {
      state,
    },
  };
};

export const setPlayers = (players) => {
  return {
    type: 'SET_PLAYERS',
    payload: {
      players,
    },
  };
};

export const addPlayer = (player) => {
  return {
    type: 'ADD_PLAYER',
    payload: {
      player,
    },
  };
};

export const removePlayer = (player) => {
  return {
    type: 'REMOVE_PLAYER',
    payload: {
      player,
    },
  };
};
