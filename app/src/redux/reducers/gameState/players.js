
/*
    Reducer for handling players in a session.
*/
const playerReducer = (state = [], action) => {
    switch (action.type) {
      // Update the list for a player.
      case 'SET_PLAYERS': {
        return action.payload.players;
      }
      case 'ADD_PLAYER': {
        const updatedState = [...state, action.payload.player]
        return updatedState;
      }
      // TODO: update this so it doesn't remove it from the list entirely, but sets the player as innactive/disconnected.
      case 'REMOVE_PLAYER': {
        const updatedState = state.filter(
          (player) => player.id !== action.payload.player.id
        );
        return updatedState;
      }
      default:
        return state;
    }
  };
  
  export default playerReducer;
  