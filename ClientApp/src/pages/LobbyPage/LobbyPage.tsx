import * as React from 'react';
import './style.scss';
import { Link, useParams } from 'react-router-dom';
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
    const { uuid } = useParams();
    const { currentPlayer, hubConnection, board } = props;

    useEffect(() => {
        hubConnection.start(currentPlayer, board, uuid);
    }, []);

    return <div>
        <div> {board?.firstPlayer?.name}</div>
        <div> {board?.secondPlayer?.name}</div>
        <button>
            <Link to="/game">
                Start game
            </Link>
        </button>

        <div>Invite link: {`http://localhost:3000/join/${uuid}`}</div>
    </div>;
};
