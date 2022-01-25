import React from 'react';
import Task from './Task/Task';
import './Topbar.css';
import { COLORS } from '../../utils/constants';

/** Component for the header component
 *
 * @returns
 */
export default function Topbar() {
  return (
    <div className='Topbar' style={{ background: COLORS.header }}>
      <Task />
    </div>
  );
}
