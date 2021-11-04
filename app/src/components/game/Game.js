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

export default function Game() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="Game">
        {/*Player 1 and 2 on the left side*/}
        <div className="GameLeft">
          <HandList codeBlocks={props.player1} player={PLAYER.P1} />
          <HandList codeBlocks={props.player2} player={PLAYER.P2} />
        </div>

        {/*Middle : Soloutionfield and Sidebar*/}
        <div className="GameCenter">
          <SolutionField codeLines={fieldProps.field} />
          <Sidebar />
        </div>

        {/*Player 3 and 4 on the left side*/}
        <div className="GameRight">
          <HandList codeBlocks={props.player3} player={PLAYER.P3} />
          <HandList codeBlocks={props.player3} player={PLAYER.P4} />
        </div>
      </div>
    </DndProvider>
  );
}
