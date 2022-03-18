import { ACTIONS } from '../../actions/ACTIONS';

/** Reducer for requesting a board lock for this player
 *  Triggers componentDidUpdate in CommunicationListener
 *
 * @param {*} state : Date when this reducer was called last time
 * @param {*} action
 * @returns
 */
const lockRequestReducer = (state = false, action) => {
  switch (action.type) {
    // Toggle between lock an unlock
    case ACTIONS.LOCK_REQUEST: {
      return !state;
    }
    default:
      return state;
  }
};

export default lockRequestReducer;
