import { ACTIONS } from '../../actions/ACTIONS';

/** Reducer for handling players in a session.
 *
 * @param {*} state : array with player objects
 * @param {*} action
 * @returns
 */
const playerReducer = (state = [], action) => {
  switch (action.type) {
    // Update a player object
    case ACTIONS.SET_PLAYERS: {
      return action.payload.players;
    }
    // Append a player object ti the array.
    case ACTIONS.ADD_PLAYER: {
      const updatedState = [...state, action.payload.player];
      return updatedState;
    }
    // TODO: update this so it doesn't remove it from the list entirely, but sets the player as innactive/disconnected.
    case ACTIONS.REMOVE_PLAYER: {
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
