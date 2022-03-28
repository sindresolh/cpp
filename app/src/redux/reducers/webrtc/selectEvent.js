import { ACTIONS } from '../../actions/ACTIONS';
import { SELECT_TYPES } from '../../../utils/constants';

/** Event triggered by host to update locks for all players
 *  Triggers componentDidUpdate in CommunicationListener
 *
 * @param {*} state : Who to change lock on, and wheter it should be open or closed
 * @param {*} action
 * @returns
 */
const selectEventReducer = (
  state = { pid: null, index: null, type: SELECT_TYPES.UNDEFINED },
  action
) => {
  switch (action.type) {
    case ACTIONS.SELECT_EVENT: {
      return action.payload.state;
    }
    default:
      return state;
  }
};

export default selectEventReducer;
