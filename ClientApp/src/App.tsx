import React from 'react';
import './App.scss';
import { GamePage } from './pages/GamePage/GamePage';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { HomePage } from './pages/HomePage/HomePage';
import { LobbyPage } from './pages/LobbyPage/LobbyPage';
import { HubConnectionService } from './services/HubConnectionService';

let hubConnection = new HubConnectionService();

function App() {
  return (
    <div className="App">
      <div className="App-content">
        <Router>
          <Switch>
            <Route path="/room">
              <LobbyPage hubConnection={hubConnection} />
            </Route>
            <Route path="/game">
              <GamePage hubConnection={hubConnection} />
            </Route>
            <Route path="/">
              <HomePage />
            </Route>
          </Switch>
        </Router>
      </div>
    </div>
  );
}

export default App;
