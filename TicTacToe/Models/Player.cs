namespace TicTacToe.Models
{
    public class Player
    {
        public string Uuid { get; set; }
        public string Name { get; set; }
        public string ConnectionId { get; set; }
        public string ConnectedGameUuid { get; set; }
    }
}
