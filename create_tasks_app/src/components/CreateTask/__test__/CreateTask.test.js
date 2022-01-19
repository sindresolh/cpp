import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateTask from '../CreateTask';
import { SAMPLE_TEXT } from '../constants';

let createTask;

beforeEach(() => {
  createTask = render(<CreateTask />);
  createTask.getByTestId('createTask');
});

test('can render editor to screen', () => {
  const editor = createTask.getByTestId('editor');
  expect(editor).toBeVisible();
});

test('editor contains sample text on render', () => {
  const editor = createTask.getByTestId('editor');
  const textArea = editor.querySelector('textarea');
  expect(textArea.textContent).toBe(SAMPLE_TEXT);
});

test('can delete content in editor', () => {
  const SAMPLE_CODE = `if a < b: 
        return a
    else:
        return b
    `;
  const editor = createTask.getByTestId('editor');
  const textArea = editor.querySelector('textarea');
  fireEvent.change(textArea, { target: { value: SAMPLE_CODE } });
  expect(textArea.textContent).toBe(SAMPLE_CODE);
});
