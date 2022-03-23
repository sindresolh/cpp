import { ACTIONS } from '../../actions/ACTIONS';

/** Reducer for requesting a lock for the selected codeblock for this player
 *
 * @param {*} state : Index to request for
 * @param {*} action
 * @returns
 */
const selectRequestReducer = (state = null, action) => {
  switch (action.type) {
    // Toggle between lock an unlock
    case ACTIONS.SELECT_REQUEST: {
      return action.payload.selectRequest;
    }
    default:
      return state;
  }
};

export default selectRequestReducer;
