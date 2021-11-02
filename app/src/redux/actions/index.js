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
