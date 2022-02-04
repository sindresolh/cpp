import { ACTIONS } from '../../actions/ACTIONS';
import { STATUS } from '../../../utils/constants';

/** Keeps track of the status of the game.
 *
 * @param {*} state : lobby, game or finished
 * @param {*} action
 * @returns
 */
const status = (state = STATUS.LOBBY, action) => {
  switch (action.type) {
    case ACTIONS.START_GAME:
      return STATUS.GAME;
    case ACTIONS.FINISH_GAME:
      return STATUS.FINISHED;
    case ACTIONS.GO_TO_LOBBY:
      return STATUS.LOBBY;
    default:
      return state;
  }
};
export default status;
