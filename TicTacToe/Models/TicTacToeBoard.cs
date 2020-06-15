namespace TicTacToe.Models
{
    public class TicTacToeBoard
    {
        public string[][] Grid { get; set; }
        public Player FirstPlayer { get; set; }
        public Player SecondPlayer { get; set; }
        public string CurrentPlayerId { get; set; }
    }
}
