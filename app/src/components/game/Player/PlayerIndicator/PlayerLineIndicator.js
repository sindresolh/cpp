import React, { useState } from 'react';
import './PlayerLineIndicator.css';
import { COLORS } from '../../../../utils/constants';
import Poly from '../../../../utils/drawing/Poly';
import p1Icon from '../../../../utils/images/playerIcons/player_icon_1.png';
import p2Icon from '../../../../utils/images/playerIcons/player_icon_2.png';
import p3Icon from '../../../../utils/images/playerIcons/player_icon_3.png';
import p4Icon from '../../../../utils/images/playerIcons/player_icon_4.png';
import { PLAYER } from '../../../../utils/constants';
export default function PlayerIndicator({ selectedPlayers }) {
  const NUMBER_OF_SELECTED = selectedPlayers.filter((p) => p === true).length;
  const VISIBILITY = NUMBER_OF_SELECTED > 0 ? 'visible' : 'hidden';
  const CIRCLE_SIZE = NUMBER_OF_SELECTED * 5 + 25;
  return (
    <div className='LineIndicatorContainer' style={{ visibility: VISIBILITY }}>
      <div className='LinePlayerIcons'>
        {selectedPlayers[PLAYER.P1 - 1] ? (
          <img draggable={false} src={p1Icon} className='LinesmallPlayerIcon' />
        ) : (
          ''
        )}
        {selectedPlayers[PLAYER.P2 - 1] ? (
          <img draggable={false} src={p2Icon} className='LinesmallPlayerIcon' />
        ) : (
          ''
        )}
        {selectedPlayers[PLAYER.P3 - 1] ? (
          <img draggable={false} src={p3Icon} className='LinesmallPlayerIcon' />
        ) : (
          ''
        )}
        {selectedPlayers[PLAYER.P4 - 1] ? (
          <img draggable={false} src={p4Icon} className='LinesmallPlayerIcon' />
        ) : (
          ''
        )}
      </div>

      <svg height='100' width='100' className='LineIndicator'>
        <ellipse
          cx='50'
          cy='45'
          rx={CIRCLE_SIZE}
          ry='25'
          fill={COLORS.solutionfield}
        />
        <g transform='rotate(-90, 32.5, 32.5)'>
          <Poly sides={3} size={10} cx={20} cy={75} r={15} />
        </g>
      </svg>
    </div>
  );
}
