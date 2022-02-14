import { ACTIONS } from '../../actions/ACTIONS';
// Get the current taskset - mocking this for now
// IMPORTANT : taskset is assumed for all tests
//import { taskset } from '../../../utils/taskset1/taskset';
// TODO: Store all tasksets in one JSON file so all sets can be accessed from that import.
// TODO: --if we use a server in the future we would just fetch from there
//import tasksets from '../../../utils/tasksets/tasksets.json';
//import tasksets from '../../../utils/tasksets/simpletasks.json';
import tasksets from '../../../utils/tasksets/mediumtasks.json';

/**
 *
 * @param {Integer} number the tasket number
 */
const getTasksFromSet = (number) => {
  const set = tasksets[number - 1];
  return set;
};

const initialState = {
  tasks: getTasksFromSet(1),
  currentTaskNumber: 0,
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
    default:
      return state;
  }
};
export default taskReducer;
