namespace TicTacToe.Models
{
    public class TicTacToeBoard
    {
        public string[][] grid;
        public Player firstPlayer;
        public Player secondPlayer;
        public string CurrentPlayerId { get; set; }
    }
}
