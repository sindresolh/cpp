import { ACTIONS } from '../../actions/ACTIONS';

/**
 * Reducer for keeping track of the allocated hand lists for the current task.
 * If the players needs to restart the task this state will assure every player
 * receives the same starting blocks.
 *
 * @param {*} state : two dimensional array, with an array of codeblocks for eeach player
 * @param {*} action
 * @returns
 */
const allocatedListsReducer = (state = [[], [], [], []], action) => {
  switch (action.type) {
    case ACTIONS.SET_ALLOCATED_LISTS: {
      return action.payload.state;
    }
    default:
      return state;
  }
};

export default allocatedListsReducer;
