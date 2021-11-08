/*
    Reducer for triggering the communicationlistener
*/
const listShoutEventReducer = (state = new Date(), action) => {
  switch (action.type) {
    case 'LIST_SHOUT_EVENT': {
      return new Date();
    }
    default:
      return state;
  }
};

export default listShoutEventReducer;
