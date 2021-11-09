import React, { useEffect } from 'react';
import './Game.css';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import SolutionField from '../SolutionField/SolutionField';
import Sidebar from '../Sidebar/Sidebar';
import { PLAYER } from '../../utils/constants';
import Player from '../Player/Player';
import { useSelector, useDispatch } from 'react-redux';
import { setField, setList } from '../../redux/actions';

export default function Game() {
  const currentTask = useSelector((state) => state.currentTask);
  let currentTaskNumber = currentTask.currentTaskNumber;
  let currentTaskObject = currentTask.tasks[currentTaskNumber];
  const dispatch = useDispatch();

  // Change the handlists and soloution field when the game renders
  useEffect(() => {
    dispatch(setField(currentTaskObject.solutionField.field));
    dispatch(setList(currentTaskObject.handList.player1, PLAYER.P1 - 1));
    dispatch(setList(currentTaskObject.handList.player2, PLAYER.P2 - 1));
    dispatch(setList(currentTaskObject.handList.player3, PLAYER.P3 - 1));
    dispatch(setList(currentTaskObject.handList.player4, PLAYER.P4 - 1));
  }, [currentTaskObject]);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="Game">
        {/*Player 1 and 3 on the left side*/}
        <div className="GameLeft">
          <Player
            playerNo={PLAYER.P1}
            name={'Per'}
            codeBlocks={currentTaskObject.handList.player1}
          />
          <Player
            playerNo={PLAYER.P3}
            name={'Aase'}
            codeBlocks={currentTaskObject.handList.player3}
          />
        </div>

        {/*Middle : Soloutionfield and Sidebar*/}
        <div className="GameCenter">
          <SolutionField codeLines={currentTaskObject.solutionField.field} />
          <Sidebar />
        </div>

        {/*Player 2 and 4 on the left side*/}
        <div className="GameRight">
          <Player
            playerNo={PLAYER.P2}
            name={'Lise'}
            codeBlocks={currentTaskObject.handList.player2}
          />
          <Player
            playerNo={PLAYER.P4}
            name={'Kjetil'}
            codeBlocks={currentTaskObject.handList.player3}
          />
        </div>
      </div>
    </DndProvider>
  );
}
