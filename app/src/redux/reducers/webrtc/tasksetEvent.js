import { ACTIONS } from '../../actions/ACTIONS';

/** Reducer for updating the set taskset in the lobby
 * Triggers componentDidUpdate in CommunicationListener
 *
 * @param {*} state : Date when this reducer was called last time
 * @param {*} action
 * @returns
 */
const tasksetEventReducer = (state = new Date(), action) => {
  switch (action.type) {
    case ACTIONS.TASKSET_EVENT: {
      return new Date();
    }
    default:
      return state;
  }
};

export default tasksetEventReducer;
