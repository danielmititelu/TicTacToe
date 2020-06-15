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
                CurrentPlayerId = firstPlayer.Uuid
            };
        }

        public static TicTacToeBoard AddSecondPlayer(Player secondPlayer, TicTacToeBoard board)
        {
            board.SecondPlayer = secondPlayer;
            return board;
        }

        public static TicTacToeBoard AddMark(string playerUuid, int i, int j, TicTacToeBoard board)
        {
            if (board.CurrentPlayerId != playerUuid)
            {
                return board;
            }

            string mark;
            if (board.FirstPlayer.Uuid == playerUuid)
                mark = "X";
            else if (board.SecondPlayer.Uuid == playerUuid)
                mark = "O";
            else
                throw new Exception("Received player id is not in this game");

            board.Grid[i][j] = mark;

            board.CurrentPlayerId = board.CurrentPlayerId == board.FirstPlayer.Uuid
                ? board.SecondPlayer.Uuid
                : board.FirstPlayer.Uuid;
            return board;
        }
    }
}
