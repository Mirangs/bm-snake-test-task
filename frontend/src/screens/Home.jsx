import React, { useState, useEffect } from 'react';
import { IonPhaser } from '@ion-phaser/react';
import validator from 'validator';
import gameConfig from '../game';

export const Home = () => {
  const [game, setGame] = useState();
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      return;
    }

    if (!validator.isMongoId(userId)) {
      localStorage.removeItem('userId');
      return setError('Invalid userId');
    }

    return startGame();
  }, []);

  const startGame = () => {
    setGame(gameConfig);
  };

  const nameSubmitted = async (evt) => {
    evt.preventDefault();

    try {
      const isUserExists = await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        body: JSON.stringify({ name }),
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      }).then((res) => res.json());

      if (isUserExists.error === 'User already exists') {
        return setError(isUserExists.error);
      }

      if (isUserExists.success && isUserExists.data) {
        localStorage.setItem('userId', isUserExists.data._id);
        return startGame();
      }

      setError('Something went wrong');
    } catch (err) {
      setError('Something went wrong');
    }
  };

  const nameChanged = ({ target }) => {
    setName(target.value);
  };

  return (
    <React.Fragment>
      <h1>Home</h1>
      {!game && (
        <form action='' onSubmit={nameSubmitted}>
          <input
            type='text'
            placeholder='Enter your name'
            value={name}
            onChange={nameChanged}
          />
          <button type='submit' disabled={!name || name.length < 3}>
            Start
          </button>
          {error ? <p style={{ color: 'red' }}>{error}</p> : null}
        </form>
      )}
      <IonPhaser game={game} />
    </React.Fragment>
  );
};
