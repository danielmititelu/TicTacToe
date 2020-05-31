import * as React from 'react';
import './style.scss';
import { BoardCell } from './BoardCell/BoardCell';
import { useState, useEffect } from 'react';
import * as signalR from "@microsoft/signalr";
import { HubConnectionService } from '../../services/HubConnectionService';

let hubConnection = new HubConnectionService();

export const GamePage = () => {
    const addMark = (i: number, j: number) => {
        console.log(`${i},${j}`);
        const newBoardValues = boardValues.map((row) => row.slice());
        newBoardValues[i][j] = "X";
        setBoardValues(newBoardValues);
    }

    useEffect(() => {
        hubConnection.start();
        hubConnection.onReceiveMark((i, j) => addMark(i, j));
    }, []);

    const [boardValues, setBoardValues] = useState([["", "", ""], ["", "", ""], ["", "", ""]]);

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
