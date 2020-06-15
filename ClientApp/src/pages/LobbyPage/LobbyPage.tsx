import * as React from 'react';
import './style.scss';
import { Link, useParams } from 'react-router-dom';
import { Player } from '../../models/Player';
import { TicTacToeBoard } from '../../models/TicTacToeBoard';

interface Props {
    currentPlayer: Player;
    board: TicTacToeBoard | undefined;
}

export function LobbyPage(props: Props) {
    let { uuid } = useParams();

    return <div>
        <div> {props.board?.firstPlayer?.name}</div>
        <div> {props.board?.secondPlayer?.name}</div>
        <button>
            <Link to="/game">
                Start game
            </Link>
        </button>

        <div>Invite link: {`http://localhost:3000/join/${uuid}`}</div>
    </div>;
};
