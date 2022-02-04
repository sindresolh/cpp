import React from 'react';
import { useDispatch } from 'react-redux';
import { goToLobby } from '../../redux/actions';

function Finished() {
  const dispatch = useDispatch();

  return (
    <div className='finished'>
      <h1>Congratulations!</h1>
      <h6>TODO: oppsumering av utførelse</h6>
      <button
        onClick={() => {
          dispatch(goToLobby());
        }}
      >
        Return to lobby
      </button>
    </div>
  );
}

export default Finished;
