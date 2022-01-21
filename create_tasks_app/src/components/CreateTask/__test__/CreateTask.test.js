import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateTask from '../CreateTask';
import { SAMPLE_TEXT } from '../constants';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

let createTask;

beforeEach(() => {
  createTask = render(<CreateTask />, { wrapper: MemoryRouter });
  createTask.getByTestId('createTask');
});

describe('code editor', () => {
  it('can render editor to screen', () => {
    const editor = createTask.getByTestId('editor');
    expect(editor).toBeVisible();
  });

  it('editor contains sample text on render', () => {
    const editor = createTask.getByTestId('editor');
    const textArea = editor.querySelector('textarea');
    expect(textArea.textContent).toBe(SAMPLE_TEXT);
  });

  it('can delete content in editor', () => {
    const SAMPLE_CODE = `if a < b: 
        return a
    else:
        return b
    `;
    const editor = createTask.getByTestId('editor');
    const textArea = editor.querySelector('textarea');
    userEvent.clear(textArea);
    userEvent.type(textArea, SAMPLE_CODE);
    expect(textArea).toHaveValue(SAMPLE_CODE);
  });
});

describe('description', () => {
  it('can render description field to screen', () => {
    const description = createTask.getByTestId('description');
    expect(description).toBeVisible();
  });

  it('can write text in field', () => {
    const someText =
      'Declare two variables, find their sum and print it to screen.';
    const description = createTask.getByTestId('description');
    userEvent.type(description, someText);
    expect(createTask.getByTestId('description')).toHaveValue(someText);
  });
});

describe('hints', () => {
  it('can render hints field to screen with initial field', () => {
    const hints = createTask.getByTestId('hints');
    const hintField = hints.querySelector('#hint-0');
    expect(hintField).toBeVisible();
  });

  it('can edit initial hint field', () => {
    const someText = 'This is a hint.';
    const hints = createTask.getByTestId('hints');
    const hintField = hints.querySelector('#hint-0');
    userEvent.type(hintField, someText);
    expect(hintField).toHaveValue(someText);
  });

  it('can add up to 5 hints', () => {
    const hints = createTask.getByTestId('hints');
    let addHintButton = createTask.getByText('+');

    let hintFields = hints.querySelectorAll('textarea');
    expect(hintFields.length).toBe(1);

    userEvent.click(addHintButton);
    userEvent.click(addHintButton);
    userEvent.click(addHintButton);
    userEvent.click(addHintButton);
    hintFields = hints.querySelectorAll('textarea');
    expect(hintFields.length).toBe(5);
  });

  it('add hint button disabled after 5 hints is added', () => {
    let addHintButton = createTask.getByText('+');
    userEvent.click(addHintButton);
    userEvent.click(addHintButton);
    userEvent.click(addHintButton);
    userEvent.click(addHintButton);
    addHintButton = createTask.getByText('+');
    expect(addHintButton).toHaveAttribute('disabled');
  });

  it('can remove hints except the first one', () => {
    const hints = createTask.getByTestId('hints');
    const addHintButton = createTask.getByText('+');
    let removeHintButton = createTask.getByText('-');
    let hintFields = hints.querySelectorAll('textarea');

    expect(hintFields.length).toBe(1);
    expect(removeHintButton).toHaveAttribute('disabled');
    userEvent.click(addHintButton);
    expect(removeHintButton).not.toHaveAttribute('disabled');
    hintFields = hints.querySelectorAll('textarea');
    expect(hintFields.length).toBe(2);
    userEvent.click(removeHintButton);
    hintFields = hints.querySelectorAll('textarea');
    expect(hintFields.length).toBe(1);
  });

  describe('attempts', () => {
    it("can render attempt field and 'unlimited' checkbox", () => {
      const attempts = createTask.getByTestId('attempts');
      const attemptsInput = attempts.querySelector('input[type="number"]');
      const unlimitedCheckbox = attempts.querySelector(
        'input[type="checkbox"]'
      );
      expect(attemptsInput).toBeVisible();
      expect(unlimitedCheckbox).toBeVisible();
    });

    it('default value is 3', () => {
      const attempts = createTask.getByTestId('attempts');
      let attemptsInput = attempts.querySelector('input[type="number"]');
      expect(attemptsInput).toHaveValue(3);
    });

    it('unlimited checkbox is checked by default', () => {
      const attempts = createTask.getByTestId('attempts');
      const unlimitedCheckbox = attempts.querySelector(
        'input[type="checkbox"]'
      );
      expect(unlimitedCheckbox).toHaveAttribute('checked');
    });

    it('input field is disabled when checkbox is checked and can be toggled', () => {
      const attempts = createTask.getByTestId('attempts');
      let attemptsInput = attempts.querySelector('input[type="number"]');
      const unlimitedCheckbox = attempts.querySelector(
        'input[type="checkbox"]'
      );
      expect(unlimitedCheckbox).toHaveAttribute('checked');
      expect(attemptsInput).toHaveAttribute('disabled');
      userEvent.click(unlimitedCheckbox);
      attemptsInput = attempts.querySelector('input[type="number"]');
      expect(unlimitedCheckbox).not.toHaveAttribute('disabled');
    });

    it('can change attempts field', () => {
      let attempts = createTask.getByTestId('attempts');
      let attemptsInput = attempts.querySelector('input[type="number"]');
      const unlimitedCheckbox = attempts.querySelector(
        'input[type="checkbox"]'
      );
      expect(attemptsInput).toHaveValue(3);
      userEvent.click(unlimitedCheckbox); // uncheck to change attempts input
      attemptsInput = attempts.querySelector('input[type="number"]');
      fireEvent.change(attemptsInput, { target: { value: 1 } });
      expect(attemptsInput).toHaveValue(1);
    });
  });
});
