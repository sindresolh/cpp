import React from 'react';
import './PlayerIndicator.css';
import { COLORS } from '../../../../utils/constants';
import Poly from '../../../../utils/drawing/Poly';
import p1Icon from '../../../../utils/images/playerIcons/player_icon_1.png';
import p2Icon from '../../../../utils/images/playerIcons/player_icon_2.png';
import p3Icon from '../../../../utils/images/playerIcons/player_icon_3.png';
import p4Icon from '../../../../utils/images/playerIcons/player_icon_4.png';
import { PLAYER } from '../../../../utils/constants';
export default function PlayerIndicator({ lockArray }) {
  const ICON_SIZE = 25;
  return (
    <div className='IndicatorContainer'>
      {lockArray[PLAYER.P1 - 1] ? (
        <img src={p1Icon} className='smallPlayerIcon' />
      ) : (
        ''
      )}
      {lockArray[PLAYER.P2 - 1] ? (
        <img src={p2Icon} className='smallPlayerIcon' />
      ) : (
        ''
      )}
      {lockArray[PLAYER.P3 - 1] ? (
        <img src={p3Icon} className='smallPlayerIcon' />
      ) : (
        ''
      )}
      {lockArray[PLAYER.P4 - 1] ? (
        <img src={p4Icon} className='smallPlayerIcon' />
      ) : (
        ''
      )}

      <svg height='100' width='100' className='Indicator'>
        <circle cx='50' cy='50' r={ICON_SIZE} fill={COLORS.solutionfield} />
        <g transform='translate(0, 10)'>
          <Poly sides={3} size={10} cx={50} cy={50} r={ICON_SIZE} />
        </g>
      </svg>
    </div>
  );
}
