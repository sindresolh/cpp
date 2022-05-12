import allReducer from '../reducers';
import { createStore } from 'redux';
// import { createStore, applyMiddleware } from 'redux';
// import thunk from 'redux-thunk';                                             // PRODUCTION

// Redux store that holds global state
const store = createStore(
  allReducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() // DEBUGGING
  //applyMiddleware(thunk)                                                      // PRODUCTION
);

export default store;
