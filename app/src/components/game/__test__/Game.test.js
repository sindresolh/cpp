// Integration test for the Game
import * as redux from 'react-redux';
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import store from '../../../redux/store/store';
import { Provider } from 'react-redux';
import Game from '../Game';
import SolutionField from '../../SolutionField/SolutionField';
import { taskset } from '../../../utils/taskset1/taskset';
import '@testing-library/jest-dom';
import { nextTask } from '../../../redux/actions';

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

    expect(currentList[0]).toBe(listFromFile.player1);
    expect(currentList[1]).toBe(listFromFile.player2);
    expect(currentList[2]).toBe(listFromFile.player3);
    expect(currentList[3]).toBe(listFromFile.player4);
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
