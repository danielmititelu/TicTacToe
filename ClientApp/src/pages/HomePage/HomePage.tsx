import * as React from 'react';
import './style.scss';
import { useParams, useHistory } from 'react-router-dom';
import { Player } from '../../models/Player';
import { HubConnectionService } from '../../services/HubConnectionService';
import { useEffect } from 'react';

interface Props {
    currentPlayer: Player;
    hubConnection: HubConnectionService;
    invited: boolean;
    onChangeName: (name: string) => void;
}

export function HomePage(props: Props) {
    let { hostRoomUuid } = useParams();
    const history = useHistory();
    const { currentPlayer, hubConnection,
        invited, onChangeName } = props;

    useEffect(() => {
        hubConnection.start(currentPlayer);
    }, []);

    const joinPrivateRoom = () => {
        if (currentPlayer.uuid !== "") {
            hubConnection.joinRoom(currentPlayer, hostRoomUuid);
            history.push(`/room/${hostRoomUuid}`);
        }
    }

    const createPrivateRoom = () => {
        if (currentPlayer.uuid !== "") {
            hubConnection.createRoom(currentPlayer);
            history.push(`/room/${currentPlayer.uuid}`);
        }
    }

    return <div className="home-page">
        <h2> Tic Tac Toe</h2>
        <div> Enter your name:</div>
        <input onChange={(e) => onChangeName(e.target.value)} />
        <div>
            <button onClick={invited ? joinPrivateRoom : createPrivateRoom}>
                {invited ?
                    "Join private room"
                    :
                    "Create private room"
                }
            </button>
        </div>
    </div>;
};
