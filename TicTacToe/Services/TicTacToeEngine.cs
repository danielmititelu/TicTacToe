using System;
using TicTacToe.Models;

namespace TicTacToe.Services
{
    public static class TicTacToeEngine
    {

        public static TicTacToeBoard InitializeBoard(Player firstPlayer)
        {
            return new TicTacToeBoard
            {
                FirstPlayer = firstPlayer,
                Grid = new string[][]
                       {
                           new string[]{"", "", "" },
                           new string[]{"", "", "" },
                           new string[]{"", "", "" },
                       },
                CurrentPlayerId = firstPlayer.ConnectionId
            };
        }

        public static TicTacToeBoard AddSecondPlayer(Player secondPlayer, TicTacToeBoard board)
        {
            board.SecondPlayer = secondPlayer;
            return board;
        }

        public static TicTacToeBoard AddMark(string playerId, int i, int j, TicTacToeBoard board)
        {
            if (board.CurrentPlayerId != playerId)
            {
                return board;
            }

            string mark;
            if (board.FirstPlayer.ConnectionId == playerId)
                mark = "X";
            else if (board.SecondPlayer.ConnectionId == playerId)
                mark = "O";
            else
                throw new Exception("Received player id is not in this game");

            board.Grid[i][j] = mark;
            return board;
        }
    }
}
