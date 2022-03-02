import React from 'react';
import { COLORS } from '../../utils/constants';
import { useMediaQuery } from 'react-responsive';

export default function PuzzleGif() {
  const showText = useMediaQuery({
    query: '(min-width: 1800px)',
  });

  return (
    <div
      style={{
        backgroundImage: `url("./puzzle.gif"),` + COLORS.background,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center top',
      }}
    >
      <h1 style={{ position: 'absolute', top: '35%', left: '43%' }}>
        {showText ? 'Waiting to connect' : ''}
      </h1>
    </div>
  );
}
