import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import SelectScreen from '../SelectScreen';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';

let selectScreen;

beforeEach(() => {
  selectScreen = render(<SelectScreen />, { wrapper: MemoryRouter });
  selectScreen.getByTestId('selectScreen');
});

test('can render elements to screen', () => {
  const title = selectScreen.getByTestId('title');
  const createTaskButton = selectScreen.getByTestId('createTaskButton');
  const createSetButton = selectScreen.getByTestId('createSetButton');

  expect(title).toBeVisible();
  expect(createTaskButton).toBeVisible();
  expect(createSetButton).toBeVisible();
});
