import React from 'react';

export default function PuzzleGif() {
  return (
    <div
      style={{
        backgroundImage: `url("./puzzle.gif")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center top',
        marginTop: '4em',
      }}
    >
      <h1 style={{ position: 'absolute', top: '40%', left: '42%' }}>
        Waiting to connect
      </h1>
    </div>
  );
}
