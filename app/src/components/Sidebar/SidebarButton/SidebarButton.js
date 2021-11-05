import React from 'react';
import './SidebarButton.css';
import { useDispatch } from 'react-redux';
import { nextTask } from '../../../redux/actions';

export default function SidebarButton({ title, handleClick }) {
  const dispatch = useDispatch();
  return <button onClick={() => dispatch(nextTask())}>{title}</button>;
}
