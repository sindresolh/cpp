import React from 'react';
import './PlayerIndicator.css';
import { COLORS } from '../../../../utils/constants';
import Poly from '../../../../utils/drawing/Poly';
export default function PlayerIndicator({ lockArray }) {
  return (
    <>
      <p>{lockArray[0] ? 'ja' : 'nei'}</p>
      <svg height='100' width='100'>
        <circle cx='50' cy='50' r='10' fill={COLORS.solutionfield} />
        <g transform='translate(0, 10)'>
          <Poly sides={3} size={10} cx={50} cy={50} r={10} />
        </g>
      </svg>
      <svg></svg>
    </>
  );
}
