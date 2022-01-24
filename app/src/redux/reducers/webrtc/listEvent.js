/** Reducer for updating the handList for the other peers in the room
 * Triggers componentDidUpdate in CommunicationListener
 *
 * @param {*} state : Date when this reducer was called last time
 * @param {*} action
 * @returns
 */
const listEventReducer = (state = new Date(), action) => {
  switch (action.type) {
    case 'LIST_EVENT': {
      return new Date();
    }
    default:
      return state;
  }
};

export default listEventReducer;
