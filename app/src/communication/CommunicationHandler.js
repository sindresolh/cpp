import React, { Component } from 'react';
import { LioWebRTC } from 'react-liowebrtc';
import CommunicationListener from './CommunicationListener';
import store from '../redux/store/store';
import { connect } from 'react-redux';
import {
  setListState,
  setFieldState,
  nextTask,
  setPlayers,
  addPlayer,
  removePlayer,
  startGame,
} from '../redux/actions';
import {
  SET_LIST,
  SET_FIELD,
  NEXT_TASK,
  CLEAR_TASK,
  START_GAME,
} from './messages';
import {
  twoDimensionalArrayIsEqual,
  arrayIsEqual,
} from '../utils/compareArrays/compareArrays';
import { clearBoard } from '../utils/shuffleCodeblocks/shuffleCodeblocks';
import PuzzleGif from '../components/Lobby/PuzzleGif';
import SidebarModal from '../components/Sidebar/SidebarModal/SidebarModal';
import SubmitIcon from '../images/buttonIcons/submit.png';
import { COLORS } from '../utils/constants';

const mapStateToProps = null;
/** Helper function to let us call dispatch from a class function
 *
 * @param {*} dispatch
 * @returns
 */
function mapDispatchToProps(dispatch) {
  return {
    dispatch_setListState: (...args) => dispatch(setListState(...args)),
    dispatch_setFieldState: (...args) => dispatch(setFieldState(...args)),
    dispatch_nextTask: (...args) => dispatch(nextTask(...args)),
    dispatch_setPlayers: (...args) => dispatch(setPlayers(...args)),
    dispatch_addPlayer: (...args) => dispatch(addPlayer(...args)),
    dispatch_removePlayer: (...args) => dispatch(removePlayer(...args)),
    dispatch_startGame: (...args) => dispatch(startGame(...args)),
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
      nick: props.nick.trim().substring(0, 20),
      isModalOpen: false,
    };
  }

  /* Close the modal. Callback from SideBarModal*/
  closeModal() {
    this.setState({ isModalOpen: false });
  }

  /**
   * Adds a new client to the room
   *
   * @param {*} webrtc : : Keeps information about the room
   * @returns
   */
  join = (webrtc) => webrtc.joinRoom('cpp-room3');

  /**
   * Called when a new peer is added to the room
   *
   * @param {*} webrtc : Keeps information about the room
   * @param {*} peer : Keeps information about the peer that sent this message
   */
  handleCreatedPeer = (webrtc, peer) => {
    const { dispatch_addPlayer } = this.props;
    dispatch_addPlayer(peer);
    console.log(`Peer-${peer.id.substring(0, 5)} joined the room!`);
  };

  /**
   * Called when a new peer leaves the room
   *
   * @param {*} webrtc : Keeps information about the room
   * @param {*} peer : Keeps information about the peer that sent this message
   */
  handlePeerLeft = (webrtc, peer) => {
    const { dispatch_removePlayer } = this.props;
    dispatch_removePlayer(peer);
    console.log(`Peer-${peer.id.substring(0, 5)} disconnected.`);
  };

  /** Called when a new peer successfully joins the room
   *
   * @param {*} webrtc : Keeps information about the room
   */
  joinedRoom = (webrtc) => {
    const { dispatch_setPlayers } = this.props;
    dispatch_setPlayers([
      ...webrtc.getPeers(),
      { id: 'YOU', nick: this.state.nick },
    ]);
    this.setState({ connected: true });
  };

  /**
   * Called when another peer in the room calls: webrtc.shout
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
      default:
        return;
    }
  };

  /**
   *  Update the blocks in a hand list.
   *
   * @param {*} payload the new state for hand list
   */
  setList(payload) {
    const { dispatch_setListState } = this.props;
    const prevState = store.getState().handList;
    const payloadState = JSON.parse(payload);

    if (!twoDimensionalArrayIsEqual(prevState, payloadState)) {
      dispatch_setListState(payloadState);
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
      this.setState({ isModalOpen: true });
      const { dispatch_nextTask } = this.props;
      dispatch_nextTask();
      this.initialFieldFromFile();
    }
  }

  /**
   * Clears the board
   */
  clearTask() {
    // Get current board state
    let field = store.getState().solutionField;
    let handList = store.getState().handList;

    // Update board
    handList = clearBoard(field, handList);
    const { dispatch_setListState } = this.props;
    dispatch_setListState(handList);
    this.initialFieldFromFile();
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
    const prevState = state.inProgress;
    const payloadState = JSON.parse(payload);

    if (prevState !== payloadState.inProgress) {
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
        options={{ dataOnly: true, nick: this.state.nick }}
        onReady={this.join}
        onCreatedPeer={this.handleCreatedPeer}
        onReceivedPeerData={this.handlePeerData}
        onRemovedPeer={this.handlePeerLeft}
        onJoinedRoom={this.joinedRoom}
      >
        {this.state.connected ? <CommunicationListener /> : <PuzzleGif />}

        {/* Fancy alert for new events, for now only shows when there is a new task*/}
        <SidebarModal
          modalIsOpen={this.state.isModalOpen}
          icon={SubmitIcon}
          title={'New task'}
          description={'Another player initiated a new task.'}
          buttonText={'Ok'}
          buttonColor={COLORS.lightgreen}
          borderColor={COLORS.darkgreen}
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
