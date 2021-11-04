// DISPATCH -> ACTION -> REDUCER (Here)

import counterReducer from './counter';
import loggedReducer from './isLogged';
import { combineReducers } from 'redux';
import handListReducer from './handList';
import solutionFieldReducer from './solutionField';

const allReducers = combineReducers({
  counter: counterReducer,
  isLogged: loggedReducer,
  handList: handListReducer,
  solutionField: solutionFieldReducer,
});
export default allReducers;
