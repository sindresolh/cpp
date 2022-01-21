// DISPATCH -> ACTION -> REDUCER (Here)

import { combineReducers } from 'redux';
import handListReducer from './handList';
import solutionFieldReducer from './solutionField';
import taskReducer from './task';
import listShoutEventReducer from './listShoutEvent';
import fieldShoutEventReducer from './fieldShoutEvent';
import newTaskShoutEventReducer from './newTaskShout';
import clearShoutEventReducer from './clearShoutEvent';
import playerReducer from './players';
import inProgressReducer from './inProgess';

const allReducers = combineReducers({
  handList: handListReducer,
  solutionField: solutionFieldReducer,
  currentTask: taskReducer,
  listShoutEvent: listShoutEventReducer,
  fieldShoutEvent: fieldShoutEventReducer,
  newTaskShoutEvent: newTaskShoutEventReducer,
  clearShoutEvent: clearShoutEventReducer,
  players: playerReducer,
  inProgress: inProgressReducer,
});
export default allReducers;
