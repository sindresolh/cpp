/*
    Reducer for adding and moving code blocks in handlists.
    Initial state is an empty two-dimentional array.
    Each "row" is the code blocks in a player's hand.
    Example: state[0] are the code blocks player 1 possess.
*/
const handListReducer = (state = [[], [], [], []], action) => {
  switch (action.type) {
    // Update the list for a player.
    case 'SET_LIST': {
      const updatedState = state.map((list, index) =>
        index === action.payload.handListIndex ? action.payload.blocks : list
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
    case 'REMOVE_BLOCK_FROM_LIST': {
      const handList = state[action.payload.handListIndex];
      const updatedHandList = handList.filter(
        (block) => block.id !== action.payload.id
      );
      const updatedState = state.map((list, index) =>
        index === action.payload.handListIndex ? updatedHandList : list
      );
      return updatedState;
    }
    case 'SET_LIST_STATE': {
      console.log('inne i reducer handlist');
      return action.payload.state;
    }
    default:
      return state;
  }
};

export default handListReducer;
