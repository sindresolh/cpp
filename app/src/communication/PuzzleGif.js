import React from 'react';
import { COLORS } from '../utils/constants';

export default function PuzzleGif() {
  return (
    <div
      style={{
        backgroundImage: `url("./puzzle.gif"),` + COLORS.background,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center top',
      }}
    >
      <h1 style={{ position: 'absolute', top: '35%', left: '42%' }}>
        Waiting to connect
      </h1>
    </div>
  );
}
