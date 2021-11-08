// DISPATCH -> ACTION -> REDUCER (Here)

import counterReducer from './counter';
import loggedReducer from './isLogged';
import { combineReducers } from 'redux';
import handListReducer from './handList';
import solutionFieldReducer from './solutionField';
import taskReducer from './task';
import listShoutEventReducer from './listShoutEvent';
import fieldShoutEventReducer from './fieldShoutEvent';

const allReducers = combineReducers({
  counter: counterReducer,
  isLogged: loggedReducer,
  handList: handListReducer,
  solutionField: solutionFieldReducer,
  currentTask: taskReducer,
  listShoutEvent: listShoutEventReducer,
  fieldShoutEvent: fieldShoutEventReducer,
});
export default allReducers;
