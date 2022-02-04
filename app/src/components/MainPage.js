import React from 'react';
import './MainPage.css';
import Topbar from './Topbar/Topbar';
import Game from './Game/Game';
import { useSelector } from 'react-redux';

export default function MainPage() {
  return (
    <div className='mainpage' data-testid='mainpage'>
      <Topbar />
      <Game />
    </div>
  );
}
