import React from 'react';
import './SidebarButton.css';

export default function SidebarButton({
  title,
  icon,
  color,
  handleClick,
  width = '7em',
  disabled = false,
}) {
  let background = disabled ? '#c2c2c2' : color;
  return (
    <button
      onClick={handleClick}
      style={{ background: background, width: width }}
      className='SideBarButton'
      disabled={disabled}
    >
      <img height='30' width='auto' src={icon} alt='Icon' />
      <div> {title} </div>
    </button>
  );
}
