import React from 'react';
import HandList from '../HandList/HandList';
import './Player.css';
import p1Icon from '../../../utils/images/playerIcons/player_icon_1.png';
import p2Icon from '../../../utils/images/playerIcons/player_icon_2.png';
import p3Icon from '../../../utils/images/playerIcons/player_icon_3.png';
import p4Icon from '../../../utils/images/playerIcons/player_icon_4.png';

/**
 * Helper function to get the correct icon.
 * @param {number} playerNo the player number (1-4)
 * @returns an imported image
 */
const getPlayerIcon = (playerNo) => {
  let icon;
  if (playerNo === 1) icon = p1Icon;
  else if (playerNo === 2) icon = p2Icon;
  else if (playerNo === 3) icon = p3Icon;
  else icon = p4Icon;
  return icon;
};

/**
 * The Player component. This component shows the player icon, name and hand list.
 * 
 * @param {number} playerNo the player number
 * @param {string} name the name of the player
 * @param {array} codeBlocks the player's blocks

 * @returns the player component
 */
function Player({ playerNo, name, codeBlocks }) {
  const icon = getPlayerIcon(playerNo);
  const draggableBlocks = name === 'YOU' || name === 'Not connected'; // allow blocks to be dragged if they are owned by the player
  return (
    <div className={`player p${playerNo}`} data-testid={`player-${playerNo}`}>
      <div className='leftContainerPlayer'>
        <img
          data-testid={`player-${playerNo}-icon`}
          src={icon}
          alt={`Player ${playerNo} icon`}
        />
        <div
          className={`player-${playerNo} name`}
          data-testid={`player-${playerNo}-name`}
        >
          {name}
        </div>
      </div>
      <div className='rightContainerPlayer'>
        <HandList
          codeBlocks={codeBlocks}
          player={playerNo}
          draggable={draggableBlocks}
        />
      </div>
    </div>
  );
}

export default Player;
