import React from 'react';

function Lobby({ handleClick }) {
  return (
    <>
      <h1>Lobby</h1>
      <button onClick={handleClick}>Start game</button>
    </>
  );
}

export default Lobby;
