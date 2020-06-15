import * as React from 'react';
import './style.scss';
import { BoardCell } from './BoardCell/BoardCell';
import { useState, useEffect } from 'react';
import { HubConnectionService } from '../../services/HubConnectionService';

interface Props {
    hubConnection: HubConnectionService
}

export function GamePage(props: Props) {
    const [boardValues, setBoardValues] = useState([["", "", ""], ["", "", ""], ["", "", ""]]);

    // useEffect(() => {
    //     props.hubConnection.start();
    // }, []);

    props.hubConnection.onReceiveBoardStatus((board: string[][]) => {
        setBoardValues(board);
    });

    const sendMarkLocation = (i: number, j: number) => {
        props.hubConnection.sendMark(i, j);
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
