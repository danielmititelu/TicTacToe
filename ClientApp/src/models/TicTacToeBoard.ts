import { Player } from "./Player";

export interface TicTacToeBoard {
    grid: string[][];
    firstPlayer: Player;
    secondPlayer: Player;
    CurrentPlayerId: string;
}