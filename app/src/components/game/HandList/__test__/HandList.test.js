import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import HandList from '../HandList';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import store from '../../../../redux/store/store';
import { Provider } from 'react-redux';

let handList;
let codelines;
const PLAYER = 1;

beforeEach(() => {
  const rendered = render(
    <Provider store={store}>
      <DndProvider backend={HTML5Backend}>
        <HandList player={PLAYER} draggable={true} />
      </DndProvider>
    </Provider>
  );
  handList = rendered.getByTestId(`handList-player${PLAYER}`);
  //codelines = rendered.getAllByTestId('codeline');
});

test('can render to screen', () => {
  expect(handList).toBeVisible();
});
