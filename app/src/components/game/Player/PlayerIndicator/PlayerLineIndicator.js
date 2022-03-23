import React, { useState } from 'react';
import './PlayerLineIndicator.css';
import { COLORS } from '../../../../utils/constants';
import Poly from '../../../../utils/drawing/Poly';
import p1Icon from '../../../../utils/images/playerIcons/player_icon_1.png';
import p2Icon from '../../../../utils/images/playerIcons/player_icon_2.png';
import p3Icon from '../../../../utils/images/playerIcons/player_icon_3.png';
import p4Icon from '../../../../utils/images/playerIcons/player_icon_4.png';
import { PLAYER } from '../../../../utils/constants';
export default function PlayerIndicator({ player }) {
  let imgSrc = '';

  switch (player) {
    case PLAYER.P1:
      imgSrc = p1Icon;
      break;
    case PLAYER.P2:
      imgSrc = p2Icon;
      break;
    case PLAYER.P3:
      imgSrc = p3Icon;
      break;
    case PLAYER.P4:
      imgSrc = p4Icon;
      break;
    default:
      break;
  }
  const VISIBILITY = imgSrc != '' ? 'visible' : 'hidden';
  return (
    <div className='IndicatorContainer' style={{ visibility: VISIBILITY }}>
      <div className='PlayerIcons'>
        <img draggable={false} src={imgSrc} className='smallPlayerIcon' />
      </div>

      <svg height='100' width='100' className='Indicator'>
        <ellipse cx='50' cy='45' rx='25' ry='25' fill={COLORS.solutionfield} />
        <g transform='rotate(-90, 32.5, 32.5)'>
          <Poly sides={3} size={10} cx={20} cy={75} r={15} />
        </g>
      </svg>
    </div>
  );
}
