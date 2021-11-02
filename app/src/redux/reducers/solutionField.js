/*
    Reducer for adding and moving code blocks in solution field.
    Initial state is an empty array.
    Each element is an object which contains a block and it's indent.
    These elements represents a line in the solution field.
*/
const solutionFieldReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_FIELD': {
      return action.payload.lines;
    }
    default:
      return state;
  }
};

export default solutionFieldReducer;
