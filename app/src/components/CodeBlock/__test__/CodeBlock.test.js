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

beforeEach(() => {
  codeBlock = render(
    <DndProvider backend={HTML5Backend}>
      <CodeBlock {...propsP1} />
    </DndProvider>
  );
  codeBlock = codeBlock.getByTestId('codeBlock-p1');
});

test('can render to screen', () => {
  expect(codeBlock.textContent).toBe('x = 1');
});

test('block border matches player colors', () => {
  let codeBlockP2 = render(
    <DndProvider backend={HTML5Backend}>
      <CodeBlock {...propsP2} />
    </DndProvider>
  );
  codeBlockP2 = codeBlockP2.getByTestId('codeBlock-p2');
  let codeBlockP3 = render(
    <DndProvider backend={HTML5Backend}>
      <CodeBlock {...propsP3} />
    </DndProvider>
  );
  codeBlockP3 = codeBlockP3.getByTestId('codeBlock-p3');
  let codeBlockP4 = render(
    <DndProvider backend={HTML5Backend}>
      <CodeBlock {...propsP4} />
    </DndProvider>
  );
  codeBlockP4 = codeBlockP4.getByTestId('codeBlock-p4');

  expect(codeBlock).toHaveClass('p1');
  expect(codeBlockP2).toHaveClass('p2');
  expect(codeBlockP3).toHaveClass('p3');
  expect(codeBlockP4).toHaveClass('p4');
});

test('block background color matches code block category', () => {
  let codeBlockP4 = render(
    <DndProvider backend={HTML5Backend}>
      <CodeBlock {...propsP4} />
    </DndProvider>
  );
  codeBlockP4 = codeBlockP4.getByTestId('codeBlock-p4');
  expect(codeBlock).toHaveClass('c1'); // variable category
  expect(codeBlockP4).toHaveClass('c2'); // function category
});

test.skip('dragging changes opacity ', () => {
  let someDiv = render(<div data-testid={'someDiv'}>some text</div>);
  someDiv = someDiv.getByTestId('someDiv');

  expect(codeBlock).not.toHaveClass('dragging');
  fireEvent.dragStart(codeBlock);
  fireEvent.dragEnter(someDiv);
  fireEvent.dragOver(someDiv);

  expect(screen.getByTestId('codeBlock-p1')).toHaveClass('dragging');
});
