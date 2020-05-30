import * as React from 'react';
import './style.scss';

export const GamePage = () => {
    return <div className="game-page">
        <table>
            <tbody>
                {[1, 2, 3].map(() =>
                    <tr>
                        {[1, 2, 3].map(() =>
                            <td className="game__cell">
                                o
                            </td>
                        )}
                    </tr>
                )}
            </tbody>
        </table>
    </div>;
};
