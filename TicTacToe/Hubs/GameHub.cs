using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Caching.Distributed;
using Newtonsoft.Json;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using TicTacToe.Models;
using TicTacToe.Services;

namespace TicTacToe.Hubs
{
    public class GameHub : Hub
    {
        private readonly IDistributedCache cache;

        public GameHub(IDistributedCache cache)
        {
            this.cache = cache;
        }

        public async Task SendMark(int i, int j)
        {
            var gameKey = "asd";
            TicTacToeBoard board;
            var encodedBoard = await cache.GetAsync(gameKey);
            if (encodedBoard == null)
            {
                board = TicTacToeEngine.InitializeBoard(
                     new Player { ConnectionId = "qwe", Name = "asd" },
                     new Player { ConnectionId = "123", Name = "qwe" }
                 );
            }
            else
            {
                board = JsonConvert.DeserializeObject<TicTacToeBoard>(Encoding.UTF8.GetString(encodedBoard));
            }

            board = TicTacToeEngine.AddMark("123", i, j, board);
            var asd = JsonConvert.SerializeObject(board);
            var boardEncoded = Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(board));
            await cache.SetAsync(gameKey, boardEncoded);
            await Clients.All.SendAsync("broadcastBoardStatus", board.grid);
        }
    }
}
