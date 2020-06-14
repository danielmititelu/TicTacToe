import * as React from 'react';
import './style.scss';
import { Link } from 'react-router-dom';
import { HubConnectionService } from '../../services/HubConnectionService';

interface Props {
    hubConnection: HubConnectionService
}

export function LobbyPage(props: Props) {
    return <div>
        Players
        <button>
            <Link to="/game">
                Start game
            </Link>
        </button>
    </div>;
};
