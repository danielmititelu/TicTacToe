import React, { useEffect, useState } from 'react';
import './App.scss';
import { GamePage } from './pages/GamePage/GamePage';
import {
  Switch,
  Route,
  useHistory,
  useParams
} from "react-router-dom";
import { HomePage } from './pages/HomePage/HomePage';
import { LobbyPage } from './pages/LobbyPage/LobbyPage';
import { HubConnectionService } from './services/HubConnectionService';
import { usePlayerFromLocalStorage } from './services/LocalStorageHook';
import { TicTacToeBoard } from './models/TicTacToeBoard';

let hubConnection = new HubConnectionService();

function App() {
  const history = useHistory();
  let { hostRoomUuid } = useParams();
  const [localPlayer, setLocalPlayer] = usePlayerFromLocalStorage();
  const [connectionError, setConnectionError] = useState(false);
  const [board, setBoard] = useState<TicTacToeBoard>();

  useEffect(() => {
    hubConnection.start()
      .then(() => {
        if (localPlayer.uuid === "") {
          hubConnection.getPlayerUuid();
        }

        if (hostRoomUuid && board) {
          hubConnection.getBoard(hostRoomUuid);
        }
        console.log('connection started');
      }).catch(error => {
        setConnectionError(true);
        console.error(error.message)
      });
  }, []);

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
          <Route path="/room/:uuid">
            <LobbyPage currentPlayer={localPlayer} board={board} />
          </Route>
          <Route path="/game">
            <GamePage hubConnection={hubConnection} />
          </Route>
          <Route path="/join/:hostRoomUuid">
            <HomePage
              invited={true}
              hubConnection={hubConnection}
              localPlayer={localPlayer}
              onChangeName={changeName}
            />
          </Route>
          <Route path="/">
            <HomePage
              invited={false}
              hubConnection={hubConnection}
              localPlayer={localPlayer}
              onChangeName={changeName}
            />
          </Route>
        </Switch>
      </div>
    </div>
  );
}

export default App;
