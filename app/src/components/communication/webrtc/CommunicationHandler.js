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
  setAllocatedListsForCurrentTask,
  setHost,
  removeHost,
  listEvent,
  fieldEvent,
  removeBlockFromField,
  removeBlockFromList,
  setList,
} from '../../../redux/actions';
import {
  SET_LIST,
  SET_FIELD,
  NEXT_TASK,
  CLEAR_TASK,
  START_GAME,
  FINISHED,
  MOVE_REQUEST,
} from './messages';
import {
  twoDimensionalArrayIsEqual,
  arrayIsEqual,
} from '../../../utils/compareArrays/compareArrays';
import { clearBoard } from '../../../utils/shuffleCodeblocks/shuffleCodeblocks';
import PuzzleGif from '../PuzzleGif';
import SidebarModal from '../../Game/Sidebar/SidebarModal/SidebarModal';
import SubmitIcon from '../../../utils/images/buttonIcons/submit.png';
import CheckIcon from '../../../utils/images/buttonIcons/check.png';
import { COLORS } from '../../../utils/constants';
import configData from '../../../config.json';
import update from 'immutability-helper';

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
    dispatch_setAllocatedListsForCurrentTask: (...args) =>
      dispatch(setAllocatedListsForCurrentTask(...args)),
    dispatch_setHost: (...args) => dispatch(setHost(...args)),
    dispatch_removeHost: (...args) => dispatch(removeHost(...args)),
    dispatch_listEvent: (...args) => dispatch(listEvent(...args)),
    dispatch_fieldEvent: (...args) => dispatch(fieldEvent(...args)),
    dispatch_removeBlockFromField: (...args) =>
      dispatch(removeBlockFromField(...args)),
    dispatch_removeBlockFromList: (...args) =>
      dispatch(removeBlockFromList(...args)),
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
  join = (webrtc) => webrtc.joinRoom('cpp-room3');

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
      default:
        return;
    }
  };

  /**
   *  Update the blocks in a hand list as well as the allocated lists for the current task.
   *
   * @param {*} payload the new state for hand list
   */
  setList(payload) {
    const { dispatch_setListState, dispatch_setAllocatedListsForCurrentTask } =
      this.props;
    const prevState = store.getState().handList;
    const payloadState = JSON.parse(payload);

    if (!twoDimensionalArrayIsEqual(prevState, payloadState)) {
      dispatch_setListState(payloadState.handList);
      dispatch_setAllocatedListsForCurrentTask(payloadState.allocatedLists);
    }
    console.log('host has sent LISTS');
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
    console.log('host has sent FIELD');
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
      this.setState({
        modalTitle: 'New task',
        modalDescription:
          'Your solution was correct! Another player initiated a new task.',
        isModalOpen: true,
        modalBorderColor: COLORS.darkgreen,
        modalButtonColor: COLORS.lightgreen,
      });
      const { dispatch_nextTask } = this.props;
      dispatch_nextTask();
      //const { dispatch_setAllocatedListsForCurrentTask } = this.props;
      //dispatch_setAllocatedListsForCurrentTask(payloadState.handList);
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
   * Another peer has requested a move that has to be validated.
   * If okay, perform the move for all players by broadcasting.
   * @param {*} payload
   * @param {*} peer
   */
  moveRequest(payload, peer) {
    console.log('someone requested a move');
    const moveRequest = JSON.parse(payload);
    const { dispatch_fieldEvent, dispatch_listEvent } = this.props;
    if (this.moveIsAccepted(moveRequest)) {
      this.moveBlock(moveRequest);

      if (moveRequest.field === 'SF')
        // broadcast what field is being updated (lists or solution field)
        dispatch_fieldEvent();
      else dispatch_listEvent();
    }
  }

  /**
   * Perform the move locally as host.
   * @param {object} moveRequest {id, index, indent, field}
   */
  moveBlock(moveRequest) {
    let blocks;
    const player = parseInt(moveRequest.field);
    const handListIndex = player - 1;
    const isAMoveInSolutionField = moveRequest.field === 'SF';

    // get blocks from solution field or handlist depending on where the move is performed
    blocks = isAMoveInSolutionField
      ? store.getState().solutionField
      : store.getState().handList[handListIndex];

    const block = this.findBlock(moveRequest.id, blocks);

    // swaps block position in handlist/solution field OR move it from list/field to the other
    if (block === undefined) {
      if (isAMoveInSolutionField)
        this.moveBlockFromList(moveRequest.id, moveRequest.index);
      else this.moveBlockFromField(moveRequest.id, moveRequest.index, player);
    } else {
      if (isAMoveInSolutionField)
        this.swapBlockPositionInField(
          block,
          moveRequest.index,
          moveRequest.indent
        );
      else this.swapBlockPositionInList(block, moveRequest.index, player);
    }
  }

  /**
   * Tried to find the block in an array.
   * @param {Integer} id
   * @param {Array} blocks
   * @returns block object if found; undefined if not
   */
  findBlock(id, blocks) {
    const block = blocks.filter((block) => block.id === id)[0];
    if (block === undefined) return undefined; // block came from solution field

    return {
      block,
      index: blocks.indexOf(block),
    };
  }

  /**
   * Moves a block from hand list to the solution field
   * @param {Integer} id
   * @param {Integer} atIndex
   */
  moveBlockFromList = (id, atIndex) => {
    const blocks = store.getState().solutionField;
    const handLists = store.getState().handList;
    let blockIsNotFound = true;
    let handListIndex = 0;
    let movedBlock;
    const AMOUNT_OF_PLAYERS = 4;
    const {
      dispatch_removeBlockFromList,
      dispatch_listEvent,
      dispatch_setFieldState,
    } = this.props;

    // find block and update the correct hand list
    while (blockIsNotFound && handListIndex < AMOUNT_OF_PLAYERS) {
      for (let block = 0; block < handLists[handListIndex].length; block++) {
        if (handLists[handListIndex][block].id === id) {
          // block is found, stop looking
          blockIsNotFound = false;
          movedBlock = handLists[handListIndex][block];
          dispatch_removeBlockFromList(id, handListIndex);
          dispatch_listEvent();
          const updatedBlocks = [
            ...blocks.slice(0, atIndex),
            movedBlock,
            ...blocks.slice(atIndex),
          ];
          dispatch_setFieldState(updatedBlocks);
        }
      }
      handListIndex++;
    }
  };

  /**
   * Swap block positions in the solution field.
   * @param {} blockObj
   * @param {*} atIndex
   * @param {*} atIndent
   */
  swapBlockPositionInField = (blockObj, atIndex, atIndent) => {
    const { dispatch_setFieldState } = this.props;
    const blocks = store.getState().solutionField;
    let block = blockObj.block;
    block.indent = atIndent;
    const updatedBlocks = update(blocks, {
      $splice: [
        [blockObj.index, 1],
        [atIndex, 0, block],
      ],
    });

    dispatch_setFieldState(updatedBlocks);
  };

  /**
   * Move a block from the field into a hand list.
   * @param {*} id
   * @param {*} atIndex
   * @param {*} player
   */
  moveBlockFromField = (id, atIndex, player) => {
    let fieldBlocks = store.getState().solutionField;
    let movedBlock = fieldBlocks.filter((block) => block.id === id)[0];
    const blocks = store.getState().handList[player - 1];
    const {
      dispatch_setList,
      dispatch_removeBlockFromField,
      dispatch_fieldEvent,
    } = this.props;

    // players cannot move their own blocks to another player's hand
    // a player can only move their own block to their own hand from solution field
    if (movedBlock !== undefined && movedBlock.player === player) {
      const updatedBlock = { ...movedBlock, indent: 0 }; // set indent to 0
      const updatedBlocks = [
        ...blocks.slice(0, atIndex),
        updatedBlock,
        ...blocks.slice(atIndex),
      ];

      dispatch_setList(updatedBlocks, player - 1);
      dispatch_removeBlockFromField(id);
      dispatch_fieldEvent();
    }
  };

  /**
   * Swap block positions in a hand list.
   * @param {*} blockObj
   * @param {*} atIndex
   * @param {*} player
   */
  swapBlockPositionInList = (blockObj, atIndex, player) => {
    const { dispatch_setList } = this.props;
    const blocks = store.getState().handList[player - 1];
    const updatedBlock = { ...blockObj.block, indent: 0 }; // set indent to 0
    const updatedBlocks = update(blocks, {
      $splice: [
        [blockObj.index, 1],
        [atIndex, 0, updatedBlock],
      ],
    });

    dispatch_setList(updatedBlocks, player - 1);
  };

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
    // // Get current board state
    // let field = store.getState().solutionField;
    // let handList = store.getState().handList;
    // // Update board
    // handList = clearBoard(field, handList);
    // const { dispatch_setListState } = this.props;
    // dispatch_setListState(handList);
    // this.initialFieldFromFile();

    const handList = store.getState().allocatedLists;
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

      const { dispatch_setAllocatedListsForCurrentTask } = this.props;
      dispatch_setAllocatedListsForCurrentTask(payloadState.handList);

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
        {this.state.finished ? (
          <SidebarModal
            modalIsOpen={this.state.isModalOpen}
            icon={CheckIcon}
            title={'Task set finished'}
            description={
              'Congratulations! Another player submitted the last task.'
            }
            buttonText={'Finish'}
            buttonColor={COLORS.lightgreen}
            borderColor={COLORS.darkgreen}
            closeModal={() => this.finishModal()}
          />
        ) : (
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
        )}
      </LioWebRTC>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommunicationHandler);
