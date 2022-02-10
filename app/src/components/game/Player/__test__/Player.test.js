import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Player from './../Player';
import {
  player1 as p1,
  player2 as p2,
  player3 as p3,
  player4 as p4,
} from './sample-players';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import store from '../../../../redux/store/store';
import { Provider } from 'react-redux';

/**
 * Gets render content for tests. Wraps Player component in
 *  necessary providers.
 *
 * @param {object} playerProps playerNo, name and codeblocks
 * @returns Content to be rendered in tests
 */
const getRenderContent = (playerProps) => {
  return (
    <Provider store={store}>
      <DndProvider backend={HTML5Backend}>
        <Player {...playerProps} />
      </DndProvider>
    </Provider>
  );
};

test('can render to screen', () => {
  const { getByTestId } = render(getRenderContent(p1));
  const player = getByTestId('player-1');
  expect(player).toBeVisible();
});

test('correct player icon is rendered', () => {
  const player1 = render(getRenderContent(p1));
  const player1Icon = player1.getByTestId('player-1-icon');
  expect(player1Icon.alt).toContain('Player 1 icon');

  const player2 = render(getRenderContent(p2));
  const player2Icon = player2.getByTestId('player-2-icon');
  expect(player2Icon.alt).toContain('Player 2 icon');

  const player3 = render(getRenderContent(p3));
  const player3Icon = player3.getByTestId('player-3-icon');
  expect(player3Icon.alt).toContain('Player 3 icon');

  const player4 = render(getRenderContent(p4));
  const player4Icon = player4.getByTestId('player-4-icon');
  expect(player4Icon.alt).toContain('Player 4 icon');
});

test('name is rendered', () => {
  const player1 = render(getRenderContent(p1));
  const name = player1.getByTestId('player-1-name');
  expect(name.textContent).toBe(p1.name);
});

test('correct name style based on player', () => {
  const player1 = render(getRenderContent(p1));
  const player1Name = player1.getByTestId('player-1-name');
  expect(player1Name).toHaveClass('player-1 name');

  const player2 = render(getRenderContent(p2));
  const player2Name = player2.getByTestId('player-2-name');
  expect(player2Name).toHaveClass('player-2 name');

  const player3 = render(getRenderContent(p3));
  const player3Name = player3.getByTestId('player-3-name');
  expect(player3Name).toHaveClass('player-3 name');

  const player4 = render(getRenderContent(p4));
  const player4Name = player4.getByTestId('player-4-name');
  expect(player4Name).toHaveClass('player-4 name');
});

test('hand list is rendered', () => {
  const player1 = render(getRenderContent(p1));
  const handList = player1.getByTestId('handList-player1');
  expect(handList).toBeVisible();
});
