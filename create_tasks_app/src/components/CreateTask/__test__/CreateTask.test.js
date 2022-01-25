import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateTask from '../CreateTask';
import { CATEGORY, SAMPLE_TEXT } from '../constants';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import {
  bifilter,
  isADistractor,
  getCodeBlocksAndDistractors,
  isNotAComment,
  categorizeCode,
} from '../util';

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

  describe('bifilter function', () => {
    it('correectly split array into two', () => {
      const numbers = [1, 2, 3, 4, 5];
      const [arr1, arr2] = bifilter((number) => number >= 3, numbers);
      expect(arr1).toStrictEqual([3, 4, 5]);
      expect(arr2).toStrictEqual([1, 2]);
    });
  });

  describe('isADistractor function', () => {
    it('distractor starts at indent 0', () => {
      const codeWithDistractor = '#$This is a distractor';
      expect(isADistractor(codeWithDistractor)).toBe(true);
    });

    it('distractor is at indent bigger than 0', () => {
      const codeWithDistractor = '      #$This is a distractor';
      expect(isADistractor(codeWithDistractor)).toBe(true);
    });

    it('comment is not a distractor', () => {
      const codeWithDistractor = '#This is NOT a comment';
      expect(isADistractor(codeWithDistractor)).toBe(false);
    });

    it('$ must come right after #', () => {
      const line = '# $This is NOT a distractor';
      expect(isADistractor(line)).toBe(false);
    });
  });

  describe('isNotAComment function', () => {
    it('not a comment', () => {
      expect(isNotAComment('not a comment')).toBe(true);
      expect(isNotAComment('#$distractor')).toBe(true);
      expect(isNotAComment('  #$distractor')).toBe(true);
    });

    it('is a comment', () => {
      expect(isNotAComment('#a comment')).toBe(false);
      expect(isNotAComment('# a comment')).toBe(false);
      expect(isNotAComment('      # a comment')).toBe(false);
    });
  });

  describe('seperate code blocks and distractors', () => {
    it('only code blocks and no distractors', () => {
      const sampleCode = 'codeline1\ncodeline2\n\tcodeline3\n\t\tcodeline4';
      const [codeBlocks, distractors] = getCodeBlocksAndDistractors(sampleCode);
      const codeBlockArray = [
        'codeline1',
        'codeline2',
        '\tcodeline3',
        '\t\tcodeline4',
      ];
      const distractorArray = [];
      expect(codeBlocks).toStrictEqual(codeBlockArray);
      expect(distractors).toStrictEqual(distractorArray);
    });

    it('no code blocks and ONLY distractors', () => {
      const sampleCode =
        '#$distractor1\n#$distractor2\n\t#$distractor3\n\t\t#$distractor4';
      const [codeBlocks, distractors] = getCodeBlocksAndDistractors(sampleCode);
      const distractorArray = [
        'distractor1',
        'distractor2',
        '\tdistractor3',
        '\t\tdistractor4',
      ];
      const codeBlockArray = [];
      expect(codeBlocks).toStrictEqual(codeBlockArray);
      expect(distractors).toStrictEqual(distractorArray);
    });

    it('codeblocks AND distractors', () => {
      const sampleCode =
        'codeBlock1\n#$distractor1\n\tcodeBlock2\n\t\t#$distractor2';
      const [codeBlocks, distractors] = getCodeBlocksAndDistractors(sampleCode);
      const codeBlockArray = ['codeBlock1', '\tcodeBlock2'];
      const distractorArray = ['distractor1', '\t\tdistractor2'];
      expect(codeBlocks).toStrictEqual(codeBlockArray);
      expect(distractors).toStrictEqual(distractorArray);
    });

    it('remove comments and blank lines', () => {
      const sampleCode =
        '#comment1\n# comment2\n\t# comment3\n\n\n\n\ncodeline\n#$distractor';
      const [codeBlocks, distractors] = getCodeBlocksAndDistractors(sampleCode);
      const codeBlockArray = ['codeline'];
      const distractorArray = ['distractor'];
      expect(codeBlocks).toStrictEqual(codeBlockArray);
      expect(distractors).toStrictEqual(distractorArray);
    });
  });

  describe('categorise code', () => {
    it("is a variable WITH space between '='", () => {
      let category;
      category = categorizeCode('variable = 2');
      expect(category).toBe(CATEGORY.VARIABLE);

      category = categorizeCode('under_score = 2');
      expect(category).toBe(CATEGORY.VARIABLE);

      category = categorizeCode("variable = 'string'");
      expect(category).toBe(CATEGORY.VARIABLE);

      category = categorizeCode('variable = 0');
      expect(category).toBe(CATEGORY.VARIABLE);

      category = categorizeCode('variable = 123');
      expect(category).toBe(CATEGORY.VARIABLE);

      category = categorizeCode('variable = function()');
      expect(category).toBe(CATEGORY.VARIABLE);

      category = categorizeCode('abc = zxw');
      expect(category).toBe(CATEGORY.VARIABLE);
    });

    it("is a variable WITHOUT space between '='", () => {
      let category;
      category = categorizeCode('variable=2');
      expect(category).toBe(CATEGORY.VARIABLE);

      category = categorizeCode('under_score=2');
      expect(category).toBe(CATEGORY.VARIABLE);

      category = categorizeCode("variable='string'");
      expect(category).toBe(CATEGORY.VARIABLE);

      category = categorizeCode('variable=0');
      expect(category).toBe(CATEGORY.VARIABLE);

      category = categorizeCode('variable=123');
      expect(category).toBe(CATEGORY.VARIABLE);

      category = categorizeCode('variable=function()');
      expect(category).toBe(CATEGORY.VARIABLE);

      category = categorizeCode('abc=zxw');
      expect(category).toBe(CATEGORY.VARIABLE);
    });

    it('is a function decleration', () => {
      let category;
      category = categorizeCode('def my_function():');
      expect(category).toBe(CATEGORY.FUNCTION);

      category = categorizeCode('def my_function(a = 2):');
      expect(category).toBe(CATEGORY.FUNCTION);

      category = categorizeCode('def my_function(a = "string"):');
      expect(category).toBe(CATEGORY.FUNCTION);

      category = categorizeCode('def my_function(one, two):');
      expect(category).toBe(CATEGORY.FUNCTION);

      category = categorizeCode('def my_function(*args):');
      expect(category).toBe(CATEGORY.FUNCTION);
    });

    it('is a function call', () => {
      let category;
      category = categorizeCode('my_function()');
      expect(category).toBe(CATEGORY.FUNCTION);

      category = categorizeCode('my_function123()');
      expect(category).toBe(CATEGORY.FUNCTION);

      category = categorizeCode('my_function(arg1, arg2)');
      expect(category).toBe(CATEGORY.FUNCTION);

      category = categorizeCode('my_function("string")');
      expect(category).toBe(CATEGORY.FUNCTION);

      category = categorizeCode("my_function('string')");
      expect(category).toBe(CATEGORY.FUNCTION);

      category = categorizeCode('my_function([])');
      expect(category).toBe(CATEGORY.FUNCTION);

      category = categorizeCode('my_function(123)');
      expect(category).toBe(CATEGORY.FUNCTION);
    });

    it('is a for loop', () => {
      let category;
      category = categorizeCode('for my_item in some_array:');
      expect(category).toBe(CATEGORY.LOOP);

      category = categorizeCode('for my_item in ["1", "2"]:');
      expect(category).toBe(CATEGORY.LOOP);

      category = categorizeCode('for my_item in range(5):');
      expect(category).toBe(CATEGORY.LOOP);
    });

    it('is a while loop', () => {
      let category;
      category = categorizeCode('while some_variable<2:');
      expect(category).toBe(CATEGORY.LOOP);

      category = categorizeCode('while some_variable < 2:');
      expect(category).toBe(CATEGORY.LOOP);

      category = categorizeCode('while some_variable<len(array):');
      expect(category).toBe(CATEGORY.LOOP);

      category = categorizeCode('while (count<2):');
      expect(category).toBe(CATEGORY.LOOP);

      category = categorizeCode('while a == 2:');
      expect(category).toBe(CATEGORY.LOOP);

      category = categorizeCode('while a != 2:');
      expect(category).toBe(CATEGORY.LOOP);

      category = categorizeCode('while a > 2:');
      expect(category).toBe(CATEGORY.LOOP);

      category = categorizeCode('while a >= 2:');
      expect(category).toBe(CATEGORY.LOOP);

      category = categorizeCode('while a <= 2:');
      expect(category).toBe(CATEGORY.LOOP);

      category = categorizeCode('while True:');
      expect(category).toBe(CATEGORY.LOOP);

      category = categorizeCode('while some_function(variable):');
      expect(category).toBe(CATEGORY.LOOP);
    });

    it('is a condition', () => {
      let category;
      category = categorizeCode('if a<123:');
      expect(category).toBe(CATEGORY.CONDITION);

      category = categorizeCode('if a < 123:');
      expect(category).toBe(CATEGORY.CONDITION);

      category = categorizeCode('if a<=123:');
      expect(category).toBe(CATEGORY.CONDITION);

      category = categorizeCode('if a==123:');
      expect(category).toBe(CATEGORY.CONDITION);

      category = categorizeCode('if a>123:');
      expect(category).toBe(CATEGORY.CONDITION);

      category = categorizeCode('if a>=123:');
      expect(category).toBe(CATEGORY.CONDITION);

      category = categorizeCode('if a!=123:');
      expect(category).toBe(CATEGORY.CONDITION);

      category = categorizeCode('if string="string":');
      expect(category).toBe(CATEGORY.CONDITION);

      category = categorizeCode("if string='string':");
      expect(category).toBe(CATEGORY.CONDITION);

      category = categorizeCode('if string="string":');
      expect(category).toBe(CATEGORY.CONDITION);

      category = categorizeCode('if abc < def:');
      expect(category).toBe(CATEGORY.CONDITION);

      category = categorizeCode('if a < len(b):');
      expect(category).toBe(CATEGORY.CONDITION);

      category = categorizeCode('elif a<2:');
      expect(category).toBe(CATEGORY.CONDITION);

      category = categorizeCode('else:');
      expect(category).toBe(CATEGORY.CONDITION);

      category = categorizeCode('if a < 2 and b >= 3:');
      expect(category).toBe(CATEGORY.CONDITION);

      category = categorizeCode('if a < 2 or b >= 3:');
      expect(category).toBe(CATEGORY.CONDITION);
    });
  });
});
