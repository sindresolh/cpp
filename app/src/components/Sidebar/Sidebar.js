import React from 'react';
import './Sidebar.css';
import './SidebarButton/SidebarButton';
import SidebarButton from './SidebarButton/SidebarButton';

export default function Sidebar() {
  return (
    <div className="Sidebar">
      <SidebarButton title="Hint" />
      <SidebarButton title="Clean" />

      <div className="BottomButton">
        <SidebarButton title="Submit" />
      </div>
    </div>
  );
}
