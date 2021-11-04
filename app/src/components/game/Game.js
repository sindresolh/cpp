import React from 'react';
import './Game.css';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import HandList from '../HandList/HandList';
import {
  sampleHandLists as props,
  sampleField as fieldProps,
} from '../../utils/sample-data';
import { PLAYER } from '../../utils/constants';

export default function Game() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="Game">
        <HandList codeBlocks={props.player1} player={1} />
      </div>
    </DndProvider>
  );
}
