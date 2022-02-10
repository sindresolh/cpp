import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import CodeBlock from '../CodeBlock';
import '@testing-library/jest-dom';
import {
  sampleBlockP1 as propsP1,
  sampleBlockP2 as propsP2,
  sampleBlockP3 as propsP3,
  sampleBlockP4 as propsP4,
} from './sample-block';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

let codeBlock; // uses props from player 1

// Mocking callback functions used in drag-and-drop functionality
const findBlock = (arg1) => ({ block: {}, index: 1 });
const moveBlock = (arg1, arg2) => {};

beforeEach(() => {
  codeBlock = render(
    // must wrap component in DnDProvider to allow dragging
    <DndProvider backend={HTML5Backend}>
      <CodeBlock {...propsP1} findBlock={findBlock} moveBlock={moveBlock} />
    </DndProvider>
  );
  codeBlock = codeBlock.getByTestId('codeBlock-player1');
});

test('can render to screen', () => {
  expect(codeBlock.textContent).toBe('x = 1');
});

test('block border matches player colors', () => {
  let codeBlockP2 = render(
    <DndProvider backend={HTML5Backend}>
      <CodeBlock {...propsP2} findBlock={findBlock} moveBlock={moveBlock} />
    </DndProvider>
  );
  codeBlockP2 = codeBlockP2.getByTestId('codeBlock-player2');

  let codeBlockP3 = render(
    <DndProvider backend={HTML5Backend}>
      <CodeBlock {...propsP3} findBlock={findBlock} moveBlock={moveBlock} />
    </DndProvider>
  );
  codeBlockP3 = codeBlockP3.getByTestId('codeBlock-player3');

  let codeBlockP4 = render(
    <DndProvider backend={HTML5Backend}>
      <CodeBlock {...propsP4} findBlock={findBlock} moveBlock={moveBlock} />
    </DndProvider>
  );
  codeBlockP4 = codeBlockP4.getByTestId('codeBlock-player4');

  expect(codeBlock).toHaveClass('player1');
  expect(codeBlockP2).toHaveClass('player2');
  expect(codeBlockP3).toHaveClass('player3');
  expect(codeBlockP4).toHaveClass('player4');
});

test('block background color matches code block category', () => {
  let variableCodeBlock = codeBlock;
  let functionCodeBlock = render(
    <DndProvider backend={HTML5Backend}>
      <CodeBlock {...propsP4} findBlock={findBlock} moveBlock={moveBlock} />
    </DndProvider>
  );
  functionCodeBlock = functionCodeBlock.getByTestId('codeBlock-player4');

  expect(variableCodeBlock).toHaveClass('variable');
  expect(functionCodeBlock).toHaveClass('function');
});

test.skip('dragging changes opacity ', () => {
  let someDiv = render(<div data-testid={'someDiv'}>some text</div>);
  someDiv = someDiv.getByTestId('someDiv');

  expect(codeBlock).not.toHaveClass('dragging');
  // TODO: fireevent to drag element
  // might help to use chrome event listeners breakpoints to figure out what event are needed to trigger dragging in the test
  expect(codeBlock).toHaveClass('dragging');
});
