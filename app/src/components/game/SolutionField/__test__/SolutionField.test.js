import React from 'react';
import { render } from '@testing-library/react';
import SolutionField from '../SolutionField';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import store from '../../../../redux/store/store';
import { Provider } from 'react-redux';
import '@testing-library/jest-dom';
import { sampleField as props } from './sample-field';

let solutionField;

beforeEach(() => {
  solutionField = render(
    <Provider store={store}>
      <DndProvider backend={HTML5Backend}>
        <SolutionField codeLines={props.field} />
      </DndProvider>
    </Provider>
  );
  solutionField = solutionField.getByTestId('solutionField');
});

test('can render to screen', () => {
  expect(solutionField).toBeVisible();
});
