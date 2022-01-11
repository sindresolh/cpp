import { removePeer } from "../actions";

/*
    Reducer for handling peers in a session.
*/
const peerReducer = (state = [], action) => {
    switch (action.type) {
      // Update the list for a player.
      case 'SET_PEERS': {
        return action.payload.peers;
      }
      case 'ADD_PEER': {
        const updatedState = [...state, action.payload.peer]
        return updatedState;
      }
      // TODO: update this so it doesn't remove it from the list entirely, but sets the player as innactive/disconnected.
      case 'REMOVE_PEER': {
        const updatedState = state.filter(
          (peer) => peer.id !== action.payload.peer.id
        );
        return updatedState;
      }
      default:
        return state;
    }
  };
  
  export default peerReducer;
  