/** Reducer for initating a board reset for other peers in the same room
 *  Triggers componentDidUpdate in CommunicationListener
 *
 * @param {*} state : Date when this reducer was called last time
 * @param {*} action
 * @returns
 */
const clearEventReducer = (state = new Date(), action) => {
  switch (action.type) {
    case 'CLEAR_EVENT': {
      return new Date();
    }
    default:
      return state;
  }
};

export default clearEventReducer;
