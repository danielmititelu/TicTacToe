import React, { useState } from 'react';
import './App.scss';
import { GamePage } from './pages/GamePage/GamePage';
import {
  Switch,
  Route,
} from "react-router-dom";
import { HomePage } from './pages/HomePage/HomePage';
import { LobbyPage } from './pages/LobbyPage/LobbyPage';
import { HubConnectionService } from './services/HubConnectionService';
import { usePlayerFromLocalStorage } from './services/LocalStorageHook';
import { TicTacToeBoard } from './models/TicTacToeBoard';

let hubConnection = new HubConnectionService();

function App() {
  const [localPlayer, setLocalPlayer] = usePlayerFromLocalStorage();
  const [board, setBoard] = useState<TicTacToeBoard>();

  hubConnection.onReceivePlayerUuid((uuid) =>
    setLocalPlayer({ ...localPlayer, uuid }));
  hubConnection.onReceiveBoard((board) => setBoard(board));

  const changeName = (name: string) => {
    setLocalPlayer({ ...localPlayer, name })
  }

  return (
    <div className="App">
      <div className="App-content">
        <Switch>
          <Route path="/room/:hostRoomUuid">
            <LobbyPage
              hubConnection={hubConnection}
              currentPlayer={localPlayer}
              board={board}
            />
          </Route>
          <Route path="/game/:hostRoomUuid">
            <GamePage hubConnection={hubConnection}
              currentPlayer={localPlayer}
              board={board}
            />
          </Route>
          <Route path="/join/:hostRoomUuid">
            <HomePage
              invited={true}
              hubConnection={hubConnection}
              currentPlayer={localPlayer}
              onChangeName={changeName}
            />
          </Route>
          <Route path="/">
            <HomePage
              invited={false}
              hubConnection={hubConnection}
              currentPlayer={localPlayer}
              onChangeName={changeName}
            />
          </Route>
        </Switch>
      </div>
    </div>
  );
}

export default App;
