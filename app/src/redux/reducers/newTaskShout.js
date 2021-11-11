/*
    Reducer for triggering the communicationlistener
*/
const newTaskShoutEventReducer = (state = new Date(), action) => {
  switch (action.type) {
    case 'NEW_TASK_SHOUT_EVENT': {
      return new Date();
    }
    default:
      return state;
  }
};

export default newTaskShoutEventReducer;
