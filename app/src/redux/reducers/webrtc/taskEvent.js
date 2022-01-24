import { ACTIONS } from '../../actions/ACTIONS';

/** Reducer for updating the task for the other peers in the room
 * Triggers componentDidUpdate in CommunicationListener
 *
 * @param {*} state : Date when this reducer was called last time
 * @param {*} action
 * @returns
 */
const taskEventReducer = (state = new Date(), action) => {
  switch (action.type) {
    case ACTIONS.TASK_EVENT: {
      return new Date();
    }
    default:
      return state;
  }
};

export default taskEventReducer;
