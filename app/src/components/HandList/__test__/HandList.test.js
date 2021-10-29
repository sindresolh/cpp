import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import HandList from '../HandList';
import { sampleHandLists as props } from './sample-list';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

let handList;

beforeEach(() => {
  handList = render(
    <DndProvider backend={HTML5Backend}>
      <HandList codeBlocks={props.player1} player={1} />
    </DndProvider>
  );
  handList = handList.getByTestId('handList-player1');
});

test('can render to screen', () => {
  expect(handList).toBeVisible();
});

test('hand list contains 4 code blocks', () => {
  const listElements = handList.children;
  expect(listElements.length).toBe(4);

  // there should be a block with in the list element
  [...listElements].map((elem) => {
    let block = elem.querySelectorAll("[data-testid='codeBlock-player1']");
    expect(block).not.toBeNull();
  });
});

/*     kanskje lettere å gjøre disse som integration tests...     */
// TODO: test for å droppe en block i lista.

// TODO: test for å bytte rekkefølge på codeblocks ved å dra en block opp eller ned
