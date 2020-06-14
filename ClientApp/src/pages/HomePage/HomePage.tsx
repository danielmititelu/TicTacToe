import * as React from 'react';
import './style.scss';
import { Link } from 'react-router-dom';

export function HomePage() {
    return <div className="home-page">
        <h2> Tic Tac Toe</h2>
        <div> Enter your name:</div>
        <input />
        <div>
            <button>
                <Link to="/room">
                    Create private room
                </Link>
            </button>
        </div>
    </div>;
};
