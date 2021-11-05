import React from 'react';
import Task from '../Task';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import store from '../../../../redux/store/store';
import { Provider } from 'react-redux';

let task;

beforeEach(() => {
  render(
    <Provider store={store}>
      <Task />
    </Provider>
  );
});

it('can render to screen', () => {
  let label = screen.getByTestId('label');
  expect(label).toBeVisible();
});

it('starts on the first task', () => {
  let label = screen.getByTestId('label');
  expect(label.textContent).toBe('Task 1');
});
