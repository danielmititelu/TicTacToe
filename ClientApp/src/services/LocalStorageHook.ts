import React, { useState } from "react";
import { Player } from "../models/Player";

export const usePlayerFromLocalStorage = (): [Player, React.Dispatch<React.SetStateAction<Player>>]  => {
    const localStorageKey = 'player';
    var localPlayer: Player = JSON.parse(localStorage.getItem(localStorageKey) || `{"name": "", "uuid": ""}`);
    const [value, setValue] = useState<Player>(
        localPlayer
    );

    React.useEffect(() => {
        localStorage.setItem(localStorageKey, JSON.stringify(value));
    }, [value]);

    return [value, setValue];
};