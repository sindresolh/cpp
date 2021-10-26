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

export const getNumber = () => {
  return {
    type: 'GET_NUMBER',
  };
};
