import * as React from 'react';
import './style.scss';
import { BoardCell } from './BoardCell/BoardCell';
import { useState, useEffect } from 'react';
import { HubConnectionService } from '../../services/HubConnectionService';
import { TicTacToeBoard } from '../../models/TicTacToeBoard';

let hubConnection = new HubConnectionService();

export const GamePage = () => {
    const [boardValues, setBoardValues] = useState([["", "", ""], ["", "", ""], ["", "", ""]]);

    useEffect(() => {
        hubConnection.start();
    }, []);

    hubConnection.onReceiveBoardStatus((board: string[][]) => {
        setBoardValues(board);
    });

    const sendMarkLocation = (i: number, j: number) => {
        hubConnection.sendMark(i, j);
    }

    return <div className="game-page">
        <table>
            <tbody>
                {boardValues.map((row, i) =>
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
