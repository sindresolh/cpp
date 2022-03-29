import { ACTIONS } from '../../actions/ACTIONS';
// Get the current taskset - mocking this for now
// IMPORTANT : taskset is assumed for all tests
//import { taskset } from '../../../utils/taskset1/taskset';
// TODO: Store all tasksets in one JSON file so all sets can be accessed from that import.
// TODO: --if we use a server in the future we would just fetch from there
import t1 from '../../../utils/tasksets/tasksets.json';
import t2 from '../../../utils/tasksets/simpletasks.json';
import t3 from '../../../utils/tasksets/mediumtasks.json';

const TASKSETS = [t1, t2, t3];

/**
 *
 * @param {Integer} number the tasket number
 */
const getTasksFromSet = (number) => {
  const set = TASKSETS[number];
  return set;
};

const initialState = {
  tasks: getTasksFromSet(0),
  currentTaskNumber: 0,
  selectedTaskSet: 0,
};

/** Reducer to store the current task number.
 *
 * @param {*} state
 * @param {*} action
 * @returns
 */
const taskReducer = (state = initialState, action) => {
  switch (action.type) {
    case ACTIONS.NEXT_TASK:
      if (state.currentTaskNumber >= state.tasks.length - 1) {
        // TODO: Make something happen when the team has completed task set
        return state;
      }
      return {
        ...state,
        currentTaskNumber: state.currentTaskNumber + 1,
      };
    case ACTIONS.SET_TASK:
      return { ...state, currentTaskNumber: action.payload.number };
    case ACTIONS.SET_TASKSET:
      return {
        ...state,
        selectedTaskSet: action.payload.number,
        tasks: getTasksFromSet(action.payload.number),
      };
    default:
      return state;
  }
};
export default taskReducer;
