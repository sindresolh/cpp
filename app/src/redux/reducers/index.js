// DISPATCH -> ACTION -> REDUCER (Here)

import { combineReducers } from 'redux';

import clearEventReducer from './webrtc/clearEvent';
import fieldEventReducer from './webrtc/fieldEvent';
import listEventReducer from './webrtc/listEvent';
import taskEventReducer from './webrtc/taskEvent';
import handListReducer from './gameLogic/handList';
import solutionFieldReducer from './gameLogic/solutionField';
import taskReducer from './gameState/task';
import playerReducer from './gameState/players';
import statusReducer from './gameState/status';
import finishReducer from './webrtc/finishEvent';
import hostReducer from './gameState/host';
import moveRequestReducer from './gameLogic/moveRequest';
import selectRequestReducer from './gameLogic/selectRequest';
import selectEventReducer from './webrtc/selectEvent';
import lockRequestReducer from './gameLogic/lockRequest';
import lockEventReducer from './webrtc/lockEvent';

const allReducers = combineReducers({
  // Handles communicication to the other peers
  clearEvent: clearEventReducer,
  fieldEvent: fieldEventReducer,
  listEvent: listEventReducer,
  taskEvent: taskEventReducer,
  finishEvent: finishReducer,

  // Controls the game board
  handList: handListReducer,
  solutionField: solutionFieldReducer,

  // Controls the state of the game
  currentTask: taskReducer,
  players: playerReducer,
  status: statusReducer,
  host: hostReducer,
  moveRequest: moveRequestReducer,
  selectRequest: selectRequestReducer,
  selectEvent: selectEventReducer,
  lockRequest: lockRequestReducer,
  lockEvent: lockEventReducer,
});
export default allReducers;
