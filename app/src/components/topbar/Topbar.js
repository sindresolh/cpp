import React from 'react';
import Task from './Task/Task';
import './Topbar.css';
import { COLORS } from '../../utils/constants';

export default function topbar() {
  return (
    <div className='Topbar' style={{ background: COLORS.header }}>
      <Task />
    </div>
  );
}
