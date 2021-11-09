// Integration test for the main page

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import store from '../../redux/store/store';
import { Provider } from 'react-redux';
import MainPage from '../MainPage';

beforeEach(() => {
  render(
    <Provider store={store}>
      <MainPage />
    </Provider>
  );
});

it('can render to screen', () => {
  let page = screen.getByTestId('mainpage');
  expect(page).toBeVisible();
});

// TODO : Test that a fireevent with submit leads to new tasks.
