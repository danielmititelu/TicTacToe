import * as React from 'react';
import './style.scss';
import { Link, useParams, useHistory } from 'react-router-dom';
import { Player } from '../../models/Player';
import { TicTacToeBoard } from '../../models/TicTacToeBoard';
import { HubConnectionService } from '../../services/HubConnectionService';
import { useEffect } from 'react';

interface Props {
    currentPlayer: Player;
    hubConnection: HubConnectionService;
    board: TicTacToeBoard | undefined;
}

export function LobbyPage(props: Props) {
    const history = useHistory();
    const { hostRoomUuid } = useParams();
    const { currentPlayer, hubConnection, board } = props;

    useEffect(() => {
        hubConnection.start(currentPlayer, board, hostRoomUuid);
    }, []);

    hubConnection.onStartGame(() => history.push(`/game/${hostRoomUuid}`));

    const startGame = () => {
        hubConnection.startGame(hostRoomUuid);
    }

    return <div>
        <div> {board?.firstPlayer?.name}</div>
        <div> {board?.secondPlayer?.name}</div>
        <button onClick={startGame}>
            Start game
        </button>

        <div>Invite link: {`http://localhost:3000/join/${hostRoomUuid}`}</div>
    </div>;
};
