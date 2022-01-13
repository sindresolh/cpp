/*
    Reducer for triggering a board reset
*/
const clearShoutEventReducer = (state = new Date(), action) => {
  switch (action.type) {
    case 'CLEAR_TASK': {
      return new Date();
    }
    default:
      return state;
  }
};

export default clearShoutEventReducer;
