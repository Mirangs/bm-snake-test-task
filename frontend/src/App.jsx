import React, { useState } from 'react';
import { Routes } from './Routes';
import Game from './game';

export const App = () => {
  const [game, setGame] = useState();

  const startGame = () => {
    setGame(new Game());
  };

  return <Routes game={game} startGame={startGame} />;
};
