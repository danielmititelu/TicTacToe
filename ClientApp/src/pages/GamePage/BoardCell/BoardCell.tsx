import * as React from 'react';
import './style.scss';

interface Props {
    value: Values | string;
    onClick: () => void;
}

export enum Values {
    x = "X",
    o = "O",
    empty = ""
}

export const BoardCell = (props: Props) => {
    return <td className="board-cell" onClick={props.onClick}>
        {props.value}
    </td>;
};
