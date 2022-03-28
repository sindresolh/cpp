import React from 'react';
import './PlayerLockIndicator.css';
import { COLORS } from '../../../../utils/constants';
import Poly from '../../../../utils/drawing/Poly';
import p1Icon from '../../../../utils/images/playerIcons/player_icon_1.png';
import p2Icon from '../../../../utils/images/playerIcons/player_icon_2.png';
import p3Icon from '../../../../utils/images/playerIcons/player_icon_3.png';
import p4Icon from '../../../../utils/images/playerIcons/player_icon_4.png';
import { PLAYER } from '../../../../utils/constants';
export default function PlayerIndicator({
  lockArray,
  numberOfLockedInPlayers,
  numberOfPlayers,
}) {
  const VISIBILITY = numberOfLockedInPlayers > 0 ? 'visible' : 'hidden';
  const CIRCLE_SIZE = numberOfLockedInPlayers * 5 + 25;
  const TRIANGLE_POSITION = numberOfLockedInPlayers * 2 + 21;
  const PLAYERICONS_OFFSET = 45 - numberOfLockedInPlayers * 8 + 'px';
  return (
    <div className='IndicatorContainer' style={{ visibility: VISIBILITY }}>
      <div className='PlayerIcons' style={{ marginRight: PLAYERICONS_OFFSET }}>
        {lockArray[PLAYER.P1 - 1] ? (
          <img draggable={false} src={p1Icon} className='smallPlayerIcon' />
        ) : (
          ''
        )}
        {lockArray[PLAYER.P2 - 1] ? (
          <img draggable={false} src={p2Icon} className='smallPlayerIcon' />
        ) : (
          ''
        )}
        {lockArray[PLAYER.P3 - 1] ? (
          <img draggable={false} src={p3Icon} className='smallPlayerIcon' />
        ) : (
          ''
        )}
        {lockArray[PLAYER.P4 - 1] ? (
          <img draggable={false} src={p4Icon} className='smallPlayerIcon' />
        ) : (
          ''
        )}
      </div>

      <svg height='100' width='100' className='Indicator'>
        <ellipse
          cx={CIRCLE_SIZE}
          cy='50'
          rx={CIRCLE_SIZE}
          ry='40'
          fill={COLORS.solutionfield}
        />
        <g transform='translate(0, 10)'>
          <Poly sides={3} size={10} cx={TRIANGLE_POSITION} cy={75} r={15} />
        </g>
        <text textAnchor='middle' x={CIRCLE_SIZE} y='75'>
          {numberOfLockedInPlayers + ' / ' + numberOfPlayers}
        </text>
      </svg>
    </div>
  );
}
