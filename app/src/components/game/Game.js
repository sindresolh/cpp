import React from 'react';
import './Game.css';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import HandList from '../HandList/HandList';
import SolutionField from '../SolutionField/SolutionField';
import Sidebar from '../Sidebar/Sidebar';
import {
  sampleHandLists as props,
  sampleField as fieldProps,
} from '../../utils/sample-data';
import { PLAYER } from '../../utils/constants';
import Player from '../Player/Player';

export default function Game() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className='Game'>
        {/*Player 1 and 2 on the left side*/}
        <div className='GameLeft'>
          <Player
            playerNo={PLAYER.P1}
            name={'Per'}
            codeBlocks={props.player1}
          />
          <Player
            playerNo={PLAYER.P3}
            name={'Aase'}
            codeBlocks={props.player3}
          />
        </div>

        {/*Middle : Soloutionfield and Sidebar*/}
        <div className='GameCenter'>
          <SolutionField codeLines={fieldProps.field} />
          <Sidebar />
        </div>

        {/*Player 3 and 4 on the left side*/}
        <div className='GameRight'>
          <Player
            playerNo={PLAYER.P2}
            name={'Lise'}
            codeBlocks={props.player2}
          />
          <Player
            playerNo={PLAYER.P4}
            name={'Kjetil'}
            codeBlocks={props.player4}
          />
        </div>
      </div>
    </DndProvider>
  );
}
