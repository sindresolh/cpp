import React from 'react';
import './SidebarButton.css';

export default function SidebarButton({ title, handleClick }) {
  return <button onClick={handleClick}>{title}</button>;
}
