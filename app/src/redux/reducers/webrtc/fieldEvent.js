import { ACTIONS } from '../../actions/ACTIONS';

/** Reducer for updating the solutionField for the other peers in the room
 * Triggers componentDidUpdate in CommunicationListener
 *
 * @param {*} state : Date when this reducer was called last time
 * @param {*} action
 * @returns
 */
const fieldEventReducer = (state = new Date(), action) => {
  switch (action.type) {
    case ACTIONS.FIELD_EVENT: {
      return new Date();
    }
    default:
      return state;
  }
};

export default fieldEventReducer;
