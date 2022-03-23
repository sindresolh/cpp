import { ACTIONS } from '../../actions/ACTIONS';

/** Event triggered by host to update locks for all players
 *  Triggers componentDidUpdate in CommunicationListener
 *
 * @param {*} state : Who to change lock on, and wheter it should be open or closed
 * @param {*} action
 * @returns
 */
const selectEventReducer = (state = { pid: null, index: null }, action) => {
  switch (action.type) {
    case ACTIONS.SELECT_EVENT: {
      return action.payload.state;
    }
    default:
      return state;
  }
};

export default selectEventReducer;
