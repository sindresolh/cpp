import React from 'react';
import './Game.css';
import {
  sampleField as fieldProps,
  sampleHandLists as listProps,
} from '../../utils/sample-data';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import SolutionField from '../SolutionField/SolutionField';
import HandList from './../HandList/HandList';
export default function Game() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className='Game'>
        <div className='leftContainer'>
          {/*/ TODO: lage player komponenter som inneholder handlist */}
          <HandList codeBlocks={listProps.player1} player={1} />
          <HandList codeBlocks={listProps.player3} player={3} />
        </div>
        <div className='middleContainer'>
          <SolutionField codeLines={fieldProps.field} />
          {/*/ TODO: legge til sidebar */}
        </div>
        <div className='rightContainer'>
          <HandList codeBlocks={listProps.player2} player={2} />
          <HandList codeBlocks={listProps.player4} player={4} />
        </div>
      </div>
    </DndProvider>
  );
}
