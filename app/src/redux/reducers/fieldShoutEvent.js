/*
    Reducer for triggering the communicationlistener
*/
const fieldShoutEventReducer = (state = new Date(), action) => {
  switch (action.type) {
    case 'FIELD_SHOUT_EVENT': {
      return new Date();
    }
    default:
      return state;
  }
};

export default fieldShoutEventReducer;
