import React from 'react';
import './MainPage.css';
import Topbar from './topbar/Topbar';
import Game from './game/Game';

export default function MainPage() {
  return (
    <div className="mainpage">
      <Topbar />
      <Game />
    </div>
  );
}
