import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import CodeLine from '../CodeLine';
import '@testing-library/jest-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { sampleBlockP1 as propsP1 } from './sample-block';
import { OFFSET } from '../../../../utils/constants';

const MAX_INDENT = 7;
const INDEX = 0;
const moveBlock = (arg1, arg2) => {}; // mock callback function
const blockId = propsP1.id;

let codeLine;
let blockRef; // the div surrounding the code block
let getByTestId;

beforeEach(() => {
  const rendered = render(
    // must wrap component in DnDProvider to allow dragging
    <DndProvider backend={HTML5Backend}>
      <CodeLine
        block={propsP1}
        index={INDEX}
        moveBlock={moveBlock}
        maxIndent={MAX_INDENT}
        draggable={true}
      />
    </DndProvider>
  );
  codeLine = rendered.getByTestId('codeline');
  blockRef = rendered.getByTestId(`blockref-${blockId}`);
});

test('can render to screen', () => {
  expect(codeLine).toBeVisible();
});

test('correct margin left based on block indent', () => {
  const blockIndent = propsP1.indent;
  const marginLeftValue = `${blockIndent * OFFSET}px`;
  expect(blockRef).toHaveStyle(`margin-left: ${marginLeftValue}`);
});
