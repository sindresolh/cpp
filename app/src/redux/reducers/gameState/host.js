import { ACTIONS } from '../../actions/ACTIONS';

/** Reducer for handling who is the host.
 *
 * @param {*} state : the peer id who has been assigned host
 * @param {*} action
 * @returns
 */
const hostReducer = (state = '', action) => {
  switch (action.type) {
    case ACTIONS.SET_HOST: {
      console.log('new host: ', action.payload.host);
      return action.payload.host;
    }
    case ACTIONS.REMOVE_HOST: {
      return '';
    }
    default:
      return state;
  }
};

export default hostReducer;
