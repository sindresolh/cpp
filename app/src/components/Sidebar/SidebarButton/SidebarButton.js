import React from 'react';
import './SidebarButton.css';

/**
 * @param {title} : Button text
 * @param {icon} : Path to image source
 * @param {icon} : Background color
 * @param {icon} : Callback function when clicked
 *
 * @returns
 */
export default function SidebarButton({ title, icon, color, handleClick }) {
  return (
    <button
      onClick={handleClick}
      style={{ background: color }}
      className='SideBarButton'
    >
      <img height='30' width='auto' src={icon} alt='Icon' />
      <div> {title} </div>
    </button>
  );
}
