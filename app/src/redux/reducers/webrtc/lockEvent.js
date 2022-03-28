import { ACTIONS } from '../../actions/ACTIONS';

/** Event triggered by host to update locks for all players
 *  Triggers componentDidUpdate in CommunicationListener
 *
 * @param {*} state : Date when this reducer was called last time
 * @param {*} action
 * @returns
 */
const lockEventReducer = (state = null, action) => {
  switch (action.type) {
    case ACTIONS.LOCK_EVENT: {
      return action.payload.state;
    }
    default:
      return state;
  }
};

export default lockEventReducer;
