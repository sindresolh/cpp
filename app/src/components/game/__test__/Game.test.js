// Integration test for the Game

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import store from '../../../redux/store/store';
import { Provider } from 'react-redux';
import Game from '../Game';

beforeEach(() => {
  render(
    <Provider store={store}>
      <Game />
    </Provider>
  );
});

it('can render to screen', () => {
  let game = screen.getByTestId('Game');
  expect(game).toBeVisible();
});

// TODO : Test that the codeblocks moves correctly by sending new dispatches
