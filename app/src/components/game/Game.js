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
import Player from '../Player/Player';
export default function Game() {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className='Game'>
        <div className='leftContainer'>
          <Player playerNo={1} name={'Per'} codeBlocks={listProps.player1} />
          <Player playerNo={3} name={'Lise'} codeBlocks={listProps.player3} />
        </div>
        <div className='middleContainer'>
          <SolutionField codeLines={fieldProps.field} />
          {/*/ TODO: legge til sidebar */}
        </div>
        <div className='rightContainer'>
          <Player playerNo={2} name={'Aase'} codeBlocks={listProps.player2} />
          <Player playerNo={4} name={'Kjetil'} codeBlocks={listProps.player4} />
        </div>
      </div>
    </DndProvider>
  );
}
