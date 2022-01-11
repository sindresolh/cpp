// DISPATCH -> ACTION (Here) -> REDUCER

// COUNTER - FROM THE TUTORIAL
export const increment = (number) => {
  return {
    type: 'INCREMENT',
    payload: number,
  };
};
export const decrement = (number) => {
  return {
    type: 'DECREMENT',
    payload: number,
  };
};
// END OF TORTURIAL STUFF - TODO

// START BOARD STATE:
export const setList = (blocks, handListIndex) => {
  return {
    type: 'SET_LIST',
    payload: {
      blocks,
      handListIndex,
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

export const setField = (lines) => {
  return {
    type: 'SET_FIELD',
    payload: {
      lines,
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

export const setFieldState = (state) => {
  return {
    type: 'SET_FIELD_STATE',
    payload: {
      state,
    },
  };
};

// END BOARD STATE

// START SYNCHRONIZATION

export const listShoutEvent = (state) => {
  return {
    type: 'LIST_SHOUT_EVENT',
    payload: {
      state,
    },
  };
};

export const fieldShoutEvent = (state) => {
  return {
    type: 'FIELD_SHOUT_EVENT',
    payload: {
      state,
    },
  };
};

export const newTaskShoutEvent = (state) => {
  return {
    type: 'NEW_TASK_SHOUT_EVENT',
    payload: {
      state,
    },
  };
};

// END SYNCHRONIZATION

// START UPDATE TASK

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
    }
  }
}

export const addPlayer = (player) => {
  return {
    type: 'ADD_Player',
    payload: {
      player
    }
  }
}

export const removePlayer = (player) => {
  return {
    type: 'REMOVE_PLAYER',
    payload: {
      player
    }
  }
}
