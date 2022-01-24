import { ACTIONS } from '../../actions/ACTIONS';

/** Keeps track of wheter or not the team has started the game
 *
 * @param {*} state : bool, true or false based on wheter or not a player pressed start
 * @param {*} action
 * @returns
 */
const inProgressReducer = (state = false, action) => {
  switch (action.type) {
    case ACTIONS.START_GAME: // the game is started from the lobby from at least one player
      return true;
    default:
      return state;
  }
};
export default inProgressReducer;
