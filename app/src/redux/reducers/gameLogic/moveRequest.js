import { ACTIONS } from '../../actions/ACTIONS';

/**  Reducer for storing the last move request a player has done.
 *
 * TODO
 * Example of a request:
 * { id, fromPos, toPos, ... }
 *
 * @param {*} state : object with move request information
 * @param {*} action
 * @returns
 */
const moveRequestReducer = (state = {}, action) => {
  switch (action.type) {
    case ACTIONS.MOVE_REQUEST: {
      return action.payload.moveRequest;
    }
    default:
      return state;
  }
};

export default moveRequestReducer;
