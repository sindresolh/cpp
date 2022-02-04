import { ACTIONS } from '../../actions/ACTIONS';

/** Reducer for signalling that the set was finished by another player.
 * Triggers componentDidUpdate in CommunicationListener
 *
 * @param {*} state : Date when this reducer was called last time
 * @param {*} action
 * @returns
 */
const finishReducer = (state = new Date(), action) => {
  switch (action.type) {
    case ACTIONS.FINISH_EVENT: {
      console.log('finish event');
      return new Date();
    }
    default:
      return state;
  }
};

export default finishReducer;
