import React from 'react';
import './MainPage.css';
import Topbar from './Topbar/Topbar';
import Game from './Game/Game';

export default function MainPage() {
  return (
    <div className="mainpage">
      <Topbar />
      <Game />
    </div>
  );
}
