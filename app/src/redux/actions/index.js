import { ACTIONS } from './ACTIONS';

/** Called to start the game for all connected players
 * See reducers/gameState/status
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

/**
 * Called to finish the game.
 * @param {*} state
 * @returns
 */
export const finishGame = (state) => {
  return {
    type: ACTIONS.FINISH_GAME,
    payload: {
      state,
    },
  };
};

/**
 * Go to the
 * @param {*} state
 * @returns
 */
export const goToLobby = (state) => {
  return {
    type: ACTIONS.GO_TO_LOBBY,
    payload: {
      state,
    },
  };
};

/** Called to set the handlist for a spesific player
 *  See reducers/gameLogic/handList
 *
 * @param {*} blocks : array of codeblocks
 * @param {*} handListIndex : player 1 has index 0, player 2 has index 1 etc.
 * @returns
 */
export const setList = (blocks, handListIndex) => {
  return {
    type: ACTIONS.SET_LIST,
    payload: {
      blocks,
      handListIndex,
    },
  };
};

/** Called to set the handlist for all players
 * See reducers/gameLogic/handList
 *
 * @param {*} blocks : two-dimensional array of codeblocks
 * @returns
 */
export const setListState = (state) => {
  return {
    type: ACTIONS.SET_LIST_STATE,
    payload: {
      state,
    },
  };
};

/** Called to remove a codeblock from a given handList
 * See reducers/gameLogic/handList
 *
 * @param {*} blockId : id of the codeblock to remove
 * @param {*} handListIndex : player to remove codeblock from
 * @returns
 */
export const removeBlockFromList = (blockId, handListIndex) => {
  return {
    type: ACTIONS.REMOVE_BLOCK_FROM_LIST,
    payload: {
      id: blockId,
      handListIndex,
    },
  };
};

/** Add a new block to the handlist
 * See reducers/gameLogic/handList
 *
 * @param {*} block
 * @returns
 */
export const addBlockToList = (block) => {
  return {
    type: ACTIONS.ADD_BLOCK_TO_LIST,
    payload: {
      block,
    },
  };
};

/** Sets the solutionfield to a given array of lines. Lines consist of codeblocks and indent data.
 *  See reducers/gameLogic/solutionField
 *
 * @param {*} state: array with codeblocks and indent information
 * @returns
 */
export const setFieldState = (state) => {
  return {
    type: ACTIONS.SET_FIELD_STATE,
    payload: {
      state,
    },
  };
};

/** Remove a codeblock from the handList based on the codeblock id
 * See reducers/gameLogic/solutionField
 *
 * @param {*} id
 * @returns
 */
export const removeBlockFromField = (id) => {
  return {
    type: ACTIONS.REMOVE_BLOCK_FROM_FIELD,
    payload: {
      id,
    },
  };
};

/** Append a codeblock to the field
 * See reducers/gameLogic/solutionField
 *
 * @param {*} id
 * @returns
 */
export const addBlockToField = (block) => {
  return {
    type: ACTIONS.ADD_BLOCK_TO_FIELD,
    payload: {
      block,
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
export const clearEvent = (state) => {
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

/**
 * Notify other players peers that the final task was submitted.
 * @param {*} state : Date when this reducer was called last time
 * @returns
 */
export const finishEvent = (state) => {
  return {
    type: ACTIONS.FINISH_EVENT,
    payload: {
      state,
    },
  };
};

/** Go the next task.
 *  See reducers/gameState/task
 *
 * @param {*} state : int, current task
 * @returns
 */
export const nextTask = (state) => {
  return {
    type: ACTIONS.NEXT_TASK,
    payload: {
      state,
    },
  };
};

/** Set task number.
 *  See reducers/gameState/task
 *
 * @param {*} state : int
 * @returns
 */
export const setTaskNumber = (number) => {
  return {
    type: ACTIONS.SET_TASK,
    payload: {
      number,
    },
  };
};

/** Update a player object
 * See reducers/gameState/player
 *
 * @param {*} players : array of players
 * @returns
 */
export const setPlayers = (players) => {
  return {
    type: ACTIONS.SET_PLAYERS,
    payload: {
      players,
    },
  };
};

/** Add a new player to the array
 * See reducers/gameState/player
 *
 * @param {*} player : array of players
 * @returns
 */
export const addPlayer = (player) => {
  return {
    type: ACTIONS.ADD_PLAYER,
    payload: {
      player,
    },
  };
};

/** Remove a player from the array
 * See reducers/gameState/player
 *
 * @param {*} player
 * @returns
 */
export const removePlayer = (player) => {
  return {
    type: ACTIONS.REMOVE_PLAYER,
    payload: {
      player,
    },
  };
};

/**
 * Sets the allocated hand lists at the beginning of a new task.
 * @param {*} state
 * @returns
 */
export const setAllocatedListsForCurrentTask = (state) => {
  return {
    type: ACTIONS.SET_ALLOCATED_LISTS,
    payload: {
      state,
    },
  };
};

/**
 * Set the host for the game. Will be called when a game is initiated.
 * @param {String} host peer id
 * @returns
 */
export const setHost = (host) => {
  return {
    type: ACTIONS.SET_HOST,
    payload: {
      host,
    },
  };
};

/**
 * Remove the stored host. Will be called when a game is finished.
 * @param {*} state
 * @returns
 */
export const removeHost = (state) => {
  return {
    type: ACTIONS.REMOVE_HOST,
    payload: {
      state,
    },
  };
};

/**
 * Player requests a move to the host. Store this request.
 * @param {*} state
 * @returns
 */
export const moveRequest = (moveRequest) => {
  return {
    type: ACTIONS.MOVE_REQUEST,
    payload: {
      moveRequest,
    },
  };
};

/** Player requests a board lock for themself. Store this request.
 *
 * @param {*} state : Date when this reducer was called last time
 * @returns
 */
export const lockRequest = (state) => {
  return {
    type: ACTIONS.LOCK_REQUEST,
    payload: {
      state,
    },
  };
};

/** As host notify other peers that the locks are updated
 *
 * @param {*} state : Date when this reducer was called last time
 * @returns
 */
export const lockEvent = (state) => {
  return {
    type: ACTIONS.LOCK_EVENT,
    payload: {
      state,
    },
  };
};
