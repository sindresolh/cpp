import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import HandList from '../HandList';
import { sampleHandLists as props } from './sample-list';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import store from '../../../redux/store/store';
import { Provider } from 'react-redux';

let handList;

beforeEach(() => {
  handList = render(
    <Provider store={store}>
      <DndProvider backend={HTML5Backend}>
        <HandList codeBlocks={props.player1} player={1} />
      </DndProvider>
    </Provider>
  );
  handList = handList.getByTestId('handList-player1');
});

test('can render to screen', () => {
  expect(handList).toBeVisible();
});
