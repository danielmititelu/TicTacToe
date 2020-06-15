import * as React from 'react';
import './style.scss';
import { useParams, useHistory } from 'react-router-dom';
import { Player } from '../../models/Player';
import { HubConnectionService } from '../../services/HubConnectionService';

interface Props {
    localPlayer: Player;
    hubConnection: HubConnectionService;
    invited: boolean;
    onChangeName: (name: string) => void;
}

export function HomePage(props: Props) {
    let { hostRoomUuid } = useParams();
    const history = useHistory();
    const { localPlayer, hubConnection,
        invited, onChangeName } = props;

    const joinPrivateRoom = () => {
        if (localPlayer.uuid !== "") {
            hubConnection.joinRoom(localPlayer, hostRoomUuid);
            history.push(`/room/${hostRoomUuid}`);
        }
    }

    const createPrivateRoom = () => {
        if (localPlayer.uuid !== "") {
            hubConnection.createRoom(localPlayer);
            history.push(`/room/${localPlayer.uuid}`);
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
