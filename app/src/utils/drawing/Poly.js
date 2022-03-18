import React from 'react';
import { COLORS } from '../constants';

const Poly = (props) => {
  let points = [];
  for (let i = 1; i < props.sides + 2; i++) {
    points.push({
      x:
        props.cx +
        Math.round(props.r * Math.sin((Math.PI / (props.sides / 2)) * i)),
      y:
        props.cy +
        Math.round(props.r * Math.cos((Math.PI / (props.sides / 2)) * i)),
    });
  }

  let pointsStr = '';
  points.forEach((val) => {
    pointsStr += `${val.x},${val.y} `;
  });

  return (
    <svg width='100' height='100'>
      <circle cx={props.cx} cy={props.cy} r={props.r} fill={'none'} />
      <polyline points={pointsStr} fill={COLORS.solutionfield} stroke='none' />
    </svg>
  );
};

export default Poly;
