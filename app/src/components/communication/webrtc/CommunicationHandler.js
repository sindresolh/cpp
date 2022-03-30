import React, { Component } from 'react';
import { LioWebRTC } from 'react-liowebrtc';
import CommunicationListener from './CommunicationListener';
import store from '../../../redux/store/store';
import { connect } from 'react-redux';
import {
  setListState,
  setFieldState,
  nextTask,
  setPlayers,
  addPlayer,
  removePlayer,
  startGame,
  finishGame,
  setTaskNumber,
  setHost,
  removeHost,
  listEvent,
  fieldEvent,
  removeBlockFromField,
  removeBlockFromList,
  setList,
  lockEvent,
  selectEvent,
} from '../../../redux/actions';
import {
  SET_LIST,
  SET_FIELD,
  NEXT_TASK,
  CLEAR_TASK,
  START_GAME,
  FINISHED,
  MOVE_REQUEST,
  LOCK_REQUEST,
  LOCK_EVENT,
  SELECT_REQUEST,
  SELECT_EVENT,
} from './messages';
import {
  twoDimensionalArrayIsEqual,
  arrayIsEqual,
} from '../../../utils/compareArrays/compareArrays';
import { clearBoard } from '../../../utils/shuffleCodeblocks/shuffleCodeblocks';
import {
  moveBlockInHandList,
  moveBlockInSolutionField,
} from '../../../utils/moveBlock/moveBlock';
import PuzzleGif from '../PuzzleGif';
import SidebarModal from '../../Game/Sidebar/SidebarModal/SidebarModal';
import SubmitIcon from '../../../utils/images/buttonIcons/submit.png';
import { COLORS, LOCKTYPES } from '../../../utils/constants';
import configData from '../../../config.json';
import {
  setLock,
  setAllLocks,
  setSelected,
} from '../../../utils/lockHelper/lockHelper';

const mapStateToProps = (state) => ({
  players: state.players,
});
/** Helper function to let us call dispatch from a class function
 *
 * @param {*} dispatch
 * @returns
 */
function mapDispatchToProps(dispatch) {
  return {
    dispatch_setListState: (...args) => dispatch(setListState(...args)),
    dispatch_setList: (...args) => dispatch(setList(...args)),
    dispatch_setFieldState: (...args) => dispatch(setFieldState(...args)),
    dispatch_nextTask: (...args) => dispatch(nextTask(...args)),
    dispatch_setPlayers: (...args) => dispatch(setPlayers(...args)),
    dispatch_addPlayer: (...args) => dispatch(addPlayer(...args)),
    dispatch_removePlayer: (...args) => dispatch(removePlayer(...args)),
    dispatch_startGame: (...args) => dispatch(startGame(...args)),
    dispatch_finishGame: (...args) => dispatch(finishGame(...args)),
    dispatch_setTaskNumber: (...args) => dispatch(setTaskNumber(...args)),
    dispatch_setHost: (...args) => dispatch(setHost(...args)),
    dispatch_removeHost: (...args) => dispatch(removeHost(...args)),
    dispatch_listEvent: (...args) => dispatch(listEvent(...args)),
    dispatch_fieldEvent: (...args) => dispatch(fieldEvent(...args)),
    dispatch_removeBlockFromField: (...args) =>
      dispatch(removeBlockFromField(...args)),
    dispatch_removeBlockFromList: (...args) =>
      dispatch(removeBlockFromList(...args)),
    dispatch_lockEvent: (...args) => dispatch(lockEvent(...args)),
    dispatch_selectEvent: (...args) => dispatch(selectEvent(...args)),
  };
}

/**
 * Handles all incoming communication.
 */
class CommunicationHandler extends Component {
  constructor(props) {
    super(props);
    this.state = {
      players: [],
      connected: false,
      nick: props.nick.trim().substring(0, 15),
      modalTitle: '',
      modalDescription: '',
      modalBorderColor: '',
      modalButtonColor: '',
      isModalOpen: false,
      finished: false,
    };
  }

  isProduction = JSON.parse(configData.PRODUCTION);

  /* Close the modal. Callback from SideBarModal*/
  closeModal() {
    this.setState({ isModalOpen: false });
    if (this.state.modalTitle === 'Room full') {
      window.location.reload();
    }
  }

  /* Close the modal, reset task number to 0 and dispatch to go to the finish screen.*/
  finishModal() {
    this.setState({ isModalOpen: false });
    this.props.dispatch_setTaskNumber(0);
    this.props.dispatch_finishGame();
  }

  /**
   * Adds a new client to the room
   *
   * @param {*} webrtc : : Keeps information about the room
   * @returns
   */
  join = (webrtc) => webrtc.joinRoom('cpp-room-mondayy');

  /**
   * Called when a new peer is added to the room
   *
   * @param {*} webrtc : Keeps information about the room
   * @param {*} peer : Keeps information about the peer that sent this message
   */
  handleCreatedPeer = (webrtc, peer) => {
    const { dispatch_addPlayer } = this.props;
    if (store.getState().players.length < 4) {
      // As long as there is less than 4 people already in the room
      dispatch_addPlayer(peer);
      if (!this.isProduction) {
        console.log(`Peer-${peer.id.substring(0, 5)} joined the room!`);
      }
    }
  };

  /**
   * Called when a new peer leaves the room
   * If the host left the room set a new host.
   *
   * @param {*} webrtc : Keeps information about the room
   * @param {*} peer : Keeps information about the peer that sent this message
   */
  handlePeerLeft = (webrtc, peer) => {
    const { dispatch_removePlayer } = this.props;
    dispatch_removePlayer(peer);
    if (!this.isProduction) {
      console.log(`Peer-${peer.id.substring(0, 5)} disconnected.`);
    }
    if (peer.id === store.getState().host) this.setNewHost();
  };

  /**
   * Set a new host if the previous host disconnected.
   * If this peer is set as new host: set host as ''.
   */
  setNewHost = () => {
    const { dispatch_setHost } = this.props;
    const players = store.getState().players;
    const newHost = players[0];

    if (newHost.id === 'YOU') dispatch_setHost('');
    else dispatch_setHost(newHost.id);
  };

  /** Called when a new peer successfully joins the room
   *
   * @param {*} webrtc : Keeps information about the room
   */
  joinedRoom = (webrtc) => {
    if (store.getState().players.length < 4) {
      // As long as there is less than 4 people already in the room
      const { dispatch_setPlayers } = this.props;
      dispatch_setPlayers([
        ...webrtc.getPeers(),
        { id: 'YOU', nick: this.state.nick },
      ]);
      this.setState({ connected: true });
    } else {
      webrtc.quit();
      this.setState({
        modalTitle: 'Room full',
        modalDescription:
          'The game you tried to join is already full. Game already has 4 players',
        isModalOpen: true,
        modalBorderColor: COLORS.darkred,
        modalButtonColor: COLORS.lightred,
      });
    }
  };

  /**
   * Called when another peer in the room calls: webrtc.shout or webrtc.broadcast
   *
   * @param {*} webrtc : Keeps information about the room
   * @param {*} type : The type of event that was called
   * @param {*} payload : Receiving data
   * @param {*} peer : Keeps information about the peer that sent this message
   */
  handlePeerData = (webrtc, type, payload, peer) => {
    switch (type) {
      case SET_LIST:
        this.setList(payload);
        break;
      case SET_FIELD:
        this.setField(payload);
        break;
      case NEXT_TASK:
        this.nextTask(payload);
        break;
      case CLEAR_TASK:
        this.clearTask();
        break;
      case START_GAME:
        this.startGame(payload, peer);
        break;
      case FINISHED:
        this.finished();
        break;
      case MOVE_REQUEST:
        this.moveRequest(payload, peer);
        break;
      case LOCK_REQUEST:
        this.lockRequest(payload, peer);
        break;
      case LOCK_EVENT:
        this.lockEvent(payload);
        break;
      case SELECT_REQUEST:
        this.selectRequest(payload, peer);
        break;
      case SELECT_EVENT:
        this.selectEvent(payload);
        break;
      default:
        break;
    }
  };

  /**
   *  Update the blocks in a hand list for the current task.
   *
   * @param {*} payload the new state for hand list
   */
  setList(payload) {
    const { dispatch_setListState } = this.props;
    const prevState = store.getState().handList;
    const payloadState = JSON.parse(payload);

    if (!twoDimensionalArrayIsEqual(prevState, payloadState)) {
      dispatch_setListState(payloadState.handList);
    }
  }

  /**
   *  Update the blocks in the solution field.
   *
   * @param {*} payload the new state for solution field
   */
  setField(payload) {
    const { dispatch_setFieldState } = this.props;
    const prevState = store.getState().solutionField;
    const payloadState = JSON.parse(payload);

    if (!arrayIsEqual(prevState, payloadState)) {
      dispatch_setFieldState(payloadState);
    }
  }

  /**
   * Get the initial solution field from file
   */
  initialFieldFromFile() {
    let currentTask = store.getState().currentTask;
    let currentTaskNumber = currentTask.currentTaskNumber;
    let currentTaskObject = currentTask.tasks[currentTaskNumber];
    let initialfield = currentTaskObject.field;
    const { dispatch_setFieldState } = this.props;
    dispatch_setFieldState(initialfield);
  }

  /**
   * Update the current task
   *
   * @param {*} payload new task
   */
  nextTask(payload) {
    const prevState = store.getState().currentTask;
    const payloadState = JSON.parse(payload);

    if (prevState !== payloadState.currentTask) {
      const { dispatch_nextTask } = this.props;
      dispatch_nextTask();
      this.initialFieldFromFile();
    }
  }
  /**
   * Another peer submitted the final task. The game is thus finished. Remove host.
   */
  finished() {
    const { dispatch_removeHost } = this.props;
    this.setState({ finished: true, isModalOpen: true });
    dispatch_removeHost();
  }

  /**
   * As a HOST it is my resposibility to handle a lock request
   *
   * @param {*} payload
   * @param {*} peer
   */
  lockRequest(payload, peer) {
    const payloadState = JSON.parse(payload);
    let lock = payloadState.lock;

    let players = store.getState().players;
    const { dispatch_lockEvent, dispatch_setPlayers } = this.props;

    if (payloadState.forWho === LOCKTYPES.FOR_MYSELF) {
      // Update the players with new locks
      dispatch_setPlayers(setLock(players, peer.id, lock));
      // Notify other peers about my approval
      dispatch_lockEvent({
        pid: peer.id,
        lock: lock,
      });
    } else if (payloadState.forWho === LOCKTYPES.ALL_PLAYERS) {
      dispatch_setPlayers(setAllLocks(players, lock));
      dispatch_lockEvent({ pid: LOCKTYPES.ALL_PLAYERS, lock: lock });
    }
  }

  /**
   * The HOST just handled a lock request (I am NOT the HOST)
   *
   * @param {*} payload
   * @param {*} peer
   */
  lockEvent(payload) {
    let payloadState = JSON.parse(payload);
    let prevState = store.getState();
    let players = prevState.players;
    const { dispatch_lockEvent, dispatch_setPlayers } = this.props;

    if (payloadState.pid === LOCKTYPES.ALL_PLAYERS) {
      dispatch_setPlayers(setAllLocks(players, payloadState.lock));
      dispatch_lockEvent({
        pid: payloadState.pid,
        lock: payloadState.lock,
      });
    } else {
      // This lock was performed by the HOST, but HOST does not know it's own name.
      if (payloadState.pid === 'HOST') {
        payloadState.pid = prevState.host;
      }

      // Find out if this long belongs to another player
      if (players.some((p) => p.id === payloadState.pid)) {
        // Update the players with new locks
        dispatch_setPlayers(
          setLock(players, payloadState.pid, payloadState.lock)
        );
        dispatch_lockEvent({
          pid: payloadState.pid,
          lock: payloadState.lock,
        });
      }
      // If it does not belong to another player it probably belongs to me
      else {
        // Update the players with new locks
        dispatch_setPlayers(setLock(players, 'YOU', payloadState.lock));
        dispatch_lockEvent({
          pid: 'YOU',
          lock: payloadState.lock,
        });
      }
    }
  }

  /**
   * As a HOST it is my resposibility to handle a select request
   *
   * @param {*} payload
   * @param {*} peer
   */
  selectRequest(payload, peer) {
    let prevState = store.getState();
    let players = prevState.players;
    let payloadState = JSON.parse(payload);

    if (payloadState != null) {
      const index = payloadState.index;
      const { dispatch_selectEvent, dispatch_setPlayers } = this.props;
      let pid = payloadState.pid === 'ME' ? peer.id : payloadState.pid;

      // If the player cannot be found it probably belongs to me
      if (!players.some((p) => p.id === pid)) {
        pid = 'YOU';
        dispatch_setPlayers(setSelected(players, 'YOU', index));
        dispatch_selectEvent({
          pid: 'HOST',
          index: index,
        });
      } else {
        dispatch_setPlayers(setSelected(players, pid, index));
        dispatch_selectEvent({
          pid: pid,
          index: index,
        });
      }
    }
  }

  /**
   * The HOST just handled a select request (I am NOT the HOST)
   *
   * @param {*} payload
   */
  selectEvent(payload) {
    const payloadState = JSON.parse(payload);
    let pid = payloadState.pid;
    let index = payloadState.index;
    let prevState = store.getState();
    let players = prevState.players;
    const { dispatch_selectEvent, dispatch_setPlayers } = this.props;

    // The host does not know its own name
    if (pid === 'HOST') {
      pid = prevState.host;
    }
    // If the player cannot be found it probably belongs to me
    if (!players.some((p) => p.id === pid)) {
      pid = 'YOU';
    }

    dispatch_setPlayers(setSelected(players, pid, index));
    dispatch_selectEvent({
      pid: pid,
      index: index,
    });
  }

  /**
   * Another peer has requested a move that has to be validated.
   * If okay, perform the move for all players by broadcasting.
   * @param {*} payload
   * @param {*} peer
   */
  moveRequest(payload, peer) {
    const moveRequest = JSON.parse(payload);
    const dispatches = {
      dispatch_fieldEvent: this.props.dispatch_fieldEvent,
      dispatch_listEvent: this.props.dispatch_listEvent,
      dispatch_removeBlockFromField: this.props.dispatch_removeBlockFromField,
      dispatch_setFieldState: this.props.dispatch_setFieldState,
      dispatch_removeBlockFromList: this.props.dispatch_removeBlockFromList,
      dispatch_setList: this.props.dispatch_setList,
    };

    if (this.moveIsAccepted(moveRequest)) {
      const { id, index, indent, field } = moveRequest;
      const player = parseInt(field);
      const handListIndex = player - 1;
      const isAMoveInSolutionField = field === 'SF';

      if (isAMoveInSolutionField) {
        moveBlockInSolutionField(
          id,
          index,
          indent,
          store.getState().solutionField,
          store.getState().handList,
          dispatches
        );
      } else {
        moveBlockInHandList(
          id,
          index,
          store.getState().solutionField,
          store.getState().handList[handListIndex],
          handListIndex,
          dispatches
        );
      }
    }
  }

  /**
   * Checks if a move should be accepted.
   * @param {object} move id, index, indent and field
   * @returns whether the move should be accepted.
   */
  moveIsAccepted(move) {
    return true; // TODO: always accepts for now
  }

  /**
   * Clears the board
   */
  clearTask() {
    const {
      dispatch_setListState,
      dispatch_fieldEvent,
      dispatch_listEvent,
      dispatch_lockEvent,
      dispatch_setPlayers,
    } = this.props;

    // Get current board state
    let field = store.getState().solutionField;
    let handList = store.getState().handList;

    let players = store.getState().players;
    dispatch_setPlayers(setAllLocks(players, false));
    dispatch_lockEvent({ pid: LOCKTYPES.ALL_PLAYERS, lock: false });

    // Update board
    handList = clearBoard(field, handList);

    dispatch_setListState(handList);
    this.initialFieldFromFile();

    dispatch_fieldEvent();
    dispatch_listEvent();
  }

  /**
   * Finds a player with a given player id.
   * Defaults to myself if not found.
   *
   * @returns
   */
  getPeer(players, pid) {
    for (let p of players) {
      if (p.id === pid) {
        return p;
      }
    }
    return { id: 'YOU', nick: this.state.nick };
  }

  /**
   * Takes the players from store and rearranges them in the order of the playerIds
   *
   * @param {*} players : array of peers from store
   * @param {*} playerIds : order of the players sent from the player that initated the game
   * @param {*} peer : the player that initiated the game
   */
  assignPlayerOrder(players, playerIds, peer) {
    let newPlayers = [];
    const { dispatch_setHost } = this.props;
    dispatch_setHost(peer.id); // set the host for this game

    while (playerIds.length > 0) {
      let pid = playerIds.shift(); // Takes out first id

      if (pid === 'YOU') {
        // This is the sender
        newPlayers.push(peer);
        continue;
      }
      newPlayers.push(this.getPeer(players, pid));
    }
    const { dispatch_setPlayers } = this.props;
    dispatch_setPlayers(newPlayers);
  }

  /** Another player started the game from the lobby
   *
   * @param {*} payload : Data sent with this message
   * @param {*} peer : Keeps information about the peer that sent this message
   */
  startGame(payload, peer) {
    const state = store.getState();
    const prevState = state.status;
    const payloadState = JSON.parse(payload);

    if (prevState !== payloadState.status) {
      const { dispatch_setListState } = this.props;
      dispatch_setListState(payloadState.handList);

      const { dispatch_setFieldState } = this.props;
      dispatch_setFieldState(payloadState.solutionField);

      const { dispatch_startGame } = this.props;
      dispatch_startGame();

      this.assignPlayerOrder(state.players, payloadState.playerIds, peer);
    }
  }

  render() {
    return (
      <LioWebRTC
        options={{
          dataOnly: true,
          nick: this.state.nick,
          debug: !this.isProduction,
        }}
        network={{
          maxPeers: 4,
        }}
        onReady={this.join}
        onCreatedPeer={this.handleCreatedPeer}
        onReceivedPeerData={this.handlePeerData} // For Peer2Peer
        onReceivedSignalData={this.handlePeerData} // For signalingserver
        onRemovedPeer={this.handlePeerLeft}
        onJoinedRoom={this.joinedRoom}
        url={configData.SERVER_URL}
      >
        {this.state.connected ? <CommunicationListener /> : <PuzzleGif />}
        {/* Fancy alert for new events, for now only shows when there is a new task*/}
        <SidebarModal
          modalIsOpen={this.state.isModalOpen}
          icon={SubmitIcon}
          title={this.state.modalTitle}
          description={this.state.modalDescription}
          buttonText={'Ok'}
          buttonColor={this.state.modalButtonColor}
          borderColor={this.state.modalBorderColor}
          closeModal={() => this.closeModal()}
        />
      </LioWebRTC>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommunicationHandler);
