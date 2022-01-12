import React from 'react';
import './SidebarButton.css';

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
