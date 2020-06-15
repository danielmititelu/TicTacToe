import * as React from 'react';
import './style.scss';
import { BoardCell } from './BoardCell/BoardCell';
import { useEffect } from 'react';
import { HubConnectionService } from '../../services/HubConnectionService';
import { Player } from '../../models/Player';
import { TicTacToeBoard } from '../../models/TicTacToeBoard';
import { useParams } from 'react-router-dom';

interface Props {
    currentPlayer: Player;
    hubConnection: HubConnectionService;
    board: TicTacToeBoard | undefined;
}

export function GamePage(props: Props) {
    const { currentPlayer, hubConnection, board } = props;
    const { hostRoomUuid } = useParams();

    useEffect(() => {
        props.hubConnection.start(currentPlayer, board, hostRoomUuid);
    }, []);

    const sendMarkLocation = (i: number, j: number) => {
        props.hubConnection.sendMark(i, j, hostRoomUuid, currentPlayer);
    }

    return <div className="game-page">
        <table>
            <tbody>
                {board?.grid.map((row, i) =>
                    <tr key={i}>
                        {row.map((value, j) =>
                            <BoardCell key={`${value}${i}${j}`} value={value}
                                onClick={() => sendMarkLocation(i, j)}
                            />
                        )}
                    </tr>
                )}
            </tbody>
        </table>
    </div>;
};
