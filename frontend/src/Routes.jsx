import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Home } from './screens/Home';
import { Ratings } from './screens/Ratings';

export const Routes = ({ game, startGame }) => (
  <Router>
    <div>
      <nav>
        <ul>
          <li>
            <Link to='/'>Home</Link>
          </li>
          <li>
            <Link to='/ratings'>Ratings</Link>
          </li>
        </ul>
      </nav>

      {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
      <Switch>
        <Route path='/ratings'>
          <Ratings game={game} />
        </Route>
        <Route path='/' exact>
          <Home game={game} startGame={startGame} />
        </Route>
      </Switch>
    </div>
  </Router>
);
