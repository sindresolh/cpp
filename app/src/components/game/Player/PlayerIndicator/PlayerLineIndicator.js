import React from 'react';
import './PlayerLineIndicator.css';
import { COLORS } from '../../../../utils/constants';
import Poly from '../../../../utils/drawing/Poly';
import p1Icon from '../../../../utils/images/playerIcons/player_icon_1.png';
import p2Icon from '../../../../utils/images/playerIcons/player_icon_2.png';
import p3Icon from '../../../../utils/images/playerIcons/player_icon_3.png';
import p4Icon from '../../../../utils/images/playerIcons/player_icon_4.png';
import { PLAYER } from '../../../../utils/constants';
export default function PlayerIndicator({ player }) {
  const VISIBILITY = player > 0 ? 'visible' : 'hidden';
  return (
    <div className='IndicatorContainer' style={{ visibility: VISIBILITY }}>
      <div className='PlayerIcons'>
        {player === PLAYER.P1 - 1 ? (
          <img draggable={false} src={p1Icon} className='smallPlayerIcon' />
        ) : (
          ''
        )}
        {player === PLAYER.P2 - 1 ? (
          <img draggable={false} src={p2Icon} className='smallPlayerIcon' />
        ) : (
          ''
        )}
        {player === PLAYER.P3 - 1 ? (
          <img draggable={false} src={p3Icon} className='smallPlayerIcon' />
        ) : (
          ''
        )}
        {player === PLAYER.P4 - 1 ? (
          <img draggable={false} src={p4Icon} className='smallPlayerIcon' />
        ) : (
          ''
        )}
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
