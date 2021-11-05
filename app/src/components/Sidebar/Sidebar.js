import React from 'react';
import './Sidebar.css';
import './SidebarButton/SidebarButton';
import SidebarButton from './SidebarButton/SidebarButton';

export default function Sidebar() {
  return (
    <div className="Sidebar">
      <div>
        <SidebarButton title="Hint" />
      </div>

      <div>
        <SidebarButton title="Clean" />
      </div>

      <div className="BottomButton">
        <SidebarButton title="Submit" />
      </div>
    </div>
  );
}
