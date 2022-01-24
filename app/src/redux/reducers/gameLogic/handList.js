import { ACTIONS } from '../../actions/ACTIONS';

/**Reducer for adding and moving code blocks in handlists.
    Initial state is an empty two-dimentional array.
    Each "row" is the code blocks in a player's hand.
    Example: state[0] are the code blocks player 1 posess.
 * 
 * @param {*} state : two dimensional array, with an array of codeblocks for eeach player
 * @param {*} action 
 * @returns 
 */
const handListReducer = (state = [[], [], [], []], action) => {
  switch (action.type) {
    // Update the list for A single player.
    case ACTIONS.SET_LIST: {
      const updatedState = state.map((list, index) =>
        index === action.payload.handListIndex ? action.payload.blocks : list
      );
      return updatedState;
    }
    // Update handlist for ALL players
    case ACTIONS.SET_LIST_STATE: {
      return action.payload.state;
    }
    // Remove a codeblock with a given id from a given handlist
    case ACTIONS.REMOVE_BLOCK_FROM_LIST: {
      const handList = state[action.payload.handListIndex];
      const updatedHandList = handList.filter(
        (block) => block.id !== action.payload.id
      );
      const updatedState = state.map((list, index) =>
        index === action.payload.handListIndex ? updatedHandList : list
      );
      return updatedState;
    }
    case 'ADD_BLOCK': {
      // TODO: we might not need this action, but let's keep it for now.
      // TODO: update to include position (index) of block
      const handList = state[action.payload.handListIndex];
      const updatedHandList = [...handList, action.payload.block];
      const updatedState = state.map((list, index) =>
        index === action.payload.handListIndex ? updatedHandList : list
      );
      return updatedState;
    }

    default:
      return state;
  }
};

export default handListReducer;
