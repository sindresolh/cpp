// EXAMPLE FILE FROM THE REDUX TUTORIAL

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement } from '../actions';

function CounterComponent() {
  const counter = useSelector((state) => state.counter);
  const isLogged = useSelector((state) => state.isLogged);

  // When dispatch is called below it will call ACTIONS
  // DISPATCH (Here) -> ACTION -> REDUCER
  const dispatch = useDispatch();
  return (
    <div>
      <h1>Counter : {counter}</h1>
      <button onClick={() => dispatch(increment(5))}>+</button>
      <button onClick={() => dispatch(decrement(5))}>-</button>

      {isLogged && <h3> Information for a user that is logged in </h3>}
    </div>
  );
}
export default CounterComponent;
