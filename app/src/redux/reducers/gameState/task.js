// Get the current taskset - mocking this for now
// IMPORTANT : taskset1 is assumed for all tests
import { taskset } from '../../../utils/taskset1/taskset';

const initialState = {
  tasks: taskset.tasks,
  currentTaskNumber: 0,
};

const taskReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'NEXT_TASK':
      if (state.currentTaskNumber >= state.tasks.length - 1) {
        // TODO: Make something happen when the team has completed task set
        return state;
      }
      return {
        ...state,
        currentTaskNumber: state.currentTaskNumber + 1,
      };
    default:
      return state;
  }
};
export default taskReducer;
