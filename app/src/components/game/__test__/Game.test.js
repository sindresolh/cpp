/* // Integration test for the Game
import * as redux from 'react-redux';
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import store from '../../../redux/store/store';
import { Provider } from 'react-redux';
import Game from '../Game';
import { taskset } from '../../../utils/taskset1/taskset';
import { PLAYER, CATEGORY } from '../../../utils/constants';
import '@testing-library/jest-dom';
import {
  nextTask,
  setField,
  setList,
  removeBlockFromField,
  removeBlockFromList,
} from '../../../redux/actions';

let game;

beforeEach(() => {
  render(
    <Provider store={store}>
      <Game />
    </Provider>
  );
  game = screen.getByTestId('Game');
});

describe('game is initialized', () => {
  it('can render to screen', () => {
    expect(game).toBeVisible();
  });

  it('soloutionfield redux store initalized', () => {
    let currentField = store.getState().solutionField;

    let fieldFromFile = taskset.tasks[0].solutionField.field;
    expect(currentField).toBe(fieldFromFile);
  });

  it('soloutionfield board initalized', () => {
    let lines = screen.getAllByTestId('lines');
    expect(lines.length).toBe(2);
  });

  it('handlist redux store initalized', () => {
    let currentList = store.getState().handList;
    let listFromFile = taskset.tasks[0].handList;

    expect(currentList[PLAYER.P1 - 1]).toBe(listFromFile.player1);
    expect(currentList[PLAYER.P2 - 1]).toBe(listFromFile.player2);
    expect(currentList[PLAYER.P3 - 1]).toBe(listFromFile.player3);
    expect(currentList[PLAYER.P4 - 1]).toBe(listFromFile.player4);
  });

  it('handlist board initalized', () => {
    let listItems = screen.getAllByTestId('listitem-player1');
    expect(listItems.length).toBe(3);

    listItems = screen.getAllByTestId('listitem-player2');
    expect(listItems.length).toBe(3);

    listItems = screen.getAllByTestId('listitem-player3');
    expect(listItems.length).toBe(3);

    listItems = screen.getAllByTestId('listitem-player4');
    expect(listItems.length).toBe(3);
  });
});

describe('can go the next task', () => {
  it('moves', () => {
    let num = store.getState().currentTask.currentTaskNumber;
    expect(num).toBe(0);
    store.dispatch(nextTask());
    num = store.getState().currentTask.currentTaskNumber;
    expect(num).toBe(1);
  });

  it('soloutionfield redux store initalized', () => {
    let currentField = store.getState().solutionField;

    let fieldFromFile = taskset.tasks[1].solutionField.field;
    expect(currentField).toBe(fieldFromFile);
  });

  it('soloutionfield board initalized', () => {
    let lines = screen.queryAllByTestId('lines');
    expect(lines.length).toBe(0);
  });

  it('handlist redux store initalized', () => {
    let currentList = store.getState().handList;
    let listFromFile = taskset.tasks[1].handList;

    expect(currentList[0]).toBe(listFromFile.player1);
    expect(currentList[1]).toBe(listFromFile.player2);
    expect(currentList[2]).toBe(listFromFile.player3);
    expect(currentList[3]).toBe(listFromFile.player4);
  });

  it('handlist board initalized', () => {
    let listItems = screen.getAllByTestId('listitem-player1');
    expect(listItems.length).toBe(2);

    listItems = screen.getAllByTestId('listitem-player2');
    expect(listItems.length).toBe(2);

    listItems = screen.getAllByTestId('listitem-player3');
    expect(listItems.length).toBe(3);

    listItems = screen.getAllByTestId('listitem-player4');
    expect(listItems.length).toBe(3);
  });
});

describe('can dispatch setField', () => {
  it('set empty', () => {
    store.dispatch(setField([]));
    let lines = screen.queryAllByTestId('lines');
    expect(lines.length).toBe(0);
  });

  it('set content', () => {
    let newField = [
      {
        block: {
          id: 'cb-7',
          content: 'z = x + y',
          player: PLAYER.P1,
          category: CATEGORY.VARIABLE,
        },
        indent: 1,
      },
      {
        block: {
          id: 'cb-8',
          content: 'print(z)',
          player: PLAYER.P2,
          category: CATEGORY.FUNCTION,
        },
        indent: 2,
      },
      {
        block: {
          id: 'cb-9',
          content: 'distractor2',
          player: PLAYER.P3,
          category: CATEGORY.VARIABLE,
        },
        indent: 3,
      },
      {
        block: {
          id: 'cb-16',
          content: 'distractor13',
          player: PLAYER.P4,
          category: CATEGORY.FUNCTION,
        },
        indent: 3,
      },
    ];

    store.dispatch(setField(newField));
    let lines = screen.queryAllByTestId('lines');
    expect(lines.length).toBe(4);

    store.dispatch(removeBlockFromField('cb-7')); // remove a block
    lines = screen.queryAllByTestId('lines');
    expect(lines.length).toBe(3);
  });
});

describe('can dispatch setList', () => {
  it('set empty', () => {
    store.dispatch(setList([], PLAYER.P1 - 1));
    let currentList = store.getState().handList;
    expect(currentList[PLAYER.P1 - 1].length).toBe(0);
  });

  it('set content', () => {
    let newList = [
      {
        id: 'cb-1',
        content: 'x = 1',
        player: PLAYER.P1,
        category: CATEGORY.VARIABLE,
      },
      {
        id: 'cb-2',
        content: 'y = 2',
        player: PLAYER.P1,
        category: CATEGORY.VARIABLE,
      },
      {
        id: 'cb-3',
        content: 'distractor1',
        player: PLAYER.P1,
        category: CATEGORY.FUNCTION,
      },
    ];

    store.dispatch(setList(newList, PLAYER.P1 - 1));
    let currentList = store.getState().handList;
    expect(currentList[PLAYER.P1 - 1].length).toBe(3);

    store.dispatch(removeBlockFromList('cb-1', 0)); // remove a block
    currentList = store.getState().handList;
    expect(currentList[PLAYER.P1 - 1].length).toBe(2);
  });
});

// setList + remove på begge.
 */
