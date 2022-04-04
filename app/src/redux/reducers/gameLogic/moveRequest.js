import { ACTIONS } from '../../actions/ACTIONS';

const initialState = {
  id: undefined,
  index: undefined,
  indent: undefined,
  field: undefined,
  timestamp: new Date().getTime(),
};

/**  Reducer for storing the last move request a player has done.
 *
 * Example of a request:
 * { '1', 2, 0, 'SF' }
 * This means: 'move block with id '1' to index 2 at indent 0 in the solution field.
 * If a player requested to move a block in their hand the field property would say either '1', '2', '3' or '4'
 * depending on who requested.
 *
 * @param {*} state : object with move request information
 * @param {*} action
 * @returns
 */
const moveRequestReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.MOVE_REQUEST: {
      return action.payload.moveRequest;
    }
    default:
      return state;
  }
};

export default moveRequestReducer;
