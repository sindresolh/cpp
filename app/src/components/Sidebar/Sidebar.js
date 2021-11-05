import React from 'react';
import './Sidebar.css';
import SidebarButton from './SidebarButton/SidebarButton';
import { useDispatch } from 'react-redux';
import { nextTask } from '../../redux/actions';

export default function Sidebar() {
  const dispatch = useDispatch();
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
