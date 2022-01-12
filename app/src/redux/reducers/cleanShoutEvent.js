/*
    Reducer for triggering a board reset
*/
const cleanShoutEventReducer = (state = new Date(), action) => {
  switch (action.type) {
    case 'CLEAN_TASK': {
      return new Date();
    }
    default:
      return state;
  }
};

export default cleanShoutEventReducer;
