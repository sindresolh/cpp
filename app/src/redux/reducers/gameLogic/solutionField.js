import { ACTIONS } from '../../actions/ACTIONS';

/**  Reducer for adding and moving code blocks in solution field.
    Initial state is an empty array.
    Each element is an object which contains a block and it's indent.
    These elements represents a line in the solution field.
 * 
 * @param {*} state : array with objects that contain codeblock and indent information
 * @param {*} action 
 * @returns 
 */
const solutionFieldReducer = (state = [], action) => {
  switch (action.type) {
    case ACTIONS.SET_FIELD_STATE: {
      return action.payload.lines;
    }
    case ACTIONS.REMOVE_BLOCK_FROM_FIELD: {
      const updatedState = state.filter(
        (line) => line.block.id !== action.payload.id
      );
      return updatedState;
    }
    default:
      return state;
  }
};

export default solutionFieldReducer;
