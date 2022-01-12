// DISPATCH -> ACTION -> REDUCER (Here)

import loggedReducer from './isLogged';
import { combineReducers } from 'redux';
import handListReducer from './handList';
import solutionFieldReducer from './solutionField';
import taskReducer from './task';
import listShoutEventReducer from './listShoutEvent';
import fieldShoutEventReducer from './fieldShoutEvent';
import newTaskShoutEventReducer from './newTaskShout';
import cleanShoutEventReducer from './cleanShoutEvent';
import playerReducer from './players';

const allReducers = combineReducers({
  isLogged: loggedReducer,
  handList: handListReducer,
  solutionField: solutionFieldReducer,
  currentTask: taskReducer,
  listShoutEvent: listShoutEventReducer,
  fieldShoutEvent: fieldShoutEventReducer,
  newTaskShoutEvent: newTaskShoutEventReducer,
  cleanShoutEvent: cleanShoutEventReducer,
  players: playerReducer,
});
export default allReducers;
