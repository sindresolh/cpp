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
