import { ACTIONS } from '../../actions/ACTIONS';

/** Reducer for requesting a board lock for this player
 *  Triggers componentDidUpdate in CommunicationListener
 *
 * @param {*} state : Date when this reducer was called last time
 * @param {*} action
 * @returns
 */
const lockRequestReducer = (
  state = { lock: false, forWho: 'NONE' },
  action
) => {
  switch (action.type) {
    // Toggle between lock an unlock
    case ACTIONS.LOCK_REQUEST: {
      return { lock: !state.lock, forWho: action.payload.forWho };
    }
    default:
      return state;
  }
};

export default lockRequestReducer;
