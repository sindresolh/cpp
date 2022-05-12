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
  const CIRCLE_SIZE = NUMBER_OF_SELECTED * 7 + 20;
  const CIRCLE_OFFSET = 58 - NUMBER_OF_SELECTED * 2;
  const PLAYER_ICON_OFFSETT = -85 - NUMBER_OF_SELECTED * 3 + 'px';
  return (
    <div className='LineIndicatorContainer' style={{ visibility: VISIBILITY }}>
      <div
        className='LinePlayerIcons'
        style={{ marginLeft: PLAYER_ICON_OFFSETT }}
      >
        {selectedPlayers[PLAYER.P1 - 1] ? (
          <img
            draggable={false}
            src={p1Icon}
            className='LinesmallPlayerIcon'
            alt='player-red'
          />
        ) : (
          ''
        )}
        {selectedPlayers[PLAYER.P2 - 1] ? (
          <img
            draggable={false}
            src={p2Icon}
            className='LinesmallPlayerIcon'
            alt='player-blue'
          />
        ) : (
          ''
        )}
        {selectedPlayers[PLAYER.P3 - 1] ? (
          <img
            draggable={false}
            src={p3Icon}
            className='LinesmallPlayerIcon'
            alt='player-yellow'
          />
        ) : (
          ''
        )}
        {selectedPlayers[PLAYER.P4 - 1] ? (
          <img
            draggable={false}
            src={p4Icon}
            className='LinesmallPlayerIcon'
            alt='player-green'
          />
        ) : (
          ''
        )}
      </div>

      <svg height='100' width='100' className='LineIndicator'>
        <ellipse
          cx={CIRCLE_OFFSET}
          cy='45'
          rx={CIRCLE_SIZE}
          ry='25'
          fill={COLORS.solutionfield}
        />
        <g transform='rotate(-90, 32.5, 32.5)'>
          <Poly sides={3} size={10} cx={20} cy={85} r={15} />
        </g>
      </svg>
    </div>
  );
}
