// DISPATCH -> ACTION -> REDUCER (Here)

import counterReducer from './counter';
import loggedReducer from './isLogged';
import { combineReducers } from 'redux';
import handListReducer from './handList';

const allReducers = combineReducers({
  counter: counterReducer,
  isLogged: loggedReducer,
  handList: handListReducer,
});
export default allReducers;
