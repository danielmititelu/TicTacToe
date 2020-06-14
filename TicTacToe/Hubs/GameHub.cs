using Microsoft.AspNetCore.SignalR;
using System;
using System.Threading.Tasks;
using TicTacToe.Models;
using TicTacToe.Services;

namespace TicTacToe.Hubs
{
    public class GameHub : Hub
    {
        private readonly CacheService cache;

        public GameHub(CacheService cache)
        {
            this.cache = cache;
        }

        public async Task CreateRoom(string name)
        {
            var uuid = Guid.NewGuid().ToString();
            var board = TicTacToeEngine.InitializeBoard(
                 new Player
                 {
                     Uuid = uuid,
                     ConnectionId = Context.ConnectionId,
                     Name = name
                 }
            );
            await cache.SaveBoardAsync(uuid, board);
            await Clients.Caller.SendAsync("roomCreated", new { name, id = uuid });
        }

        public async Task JoinRoom(string name, string roomUuid)
        {
            var board = await cache.GetBoardAsync(roomUuid);
            if (board == null)
            {
                await Clients.Caller.SendAsync("error", "room not found");
            }

            var uuid = Guid.NewGuid().ToString();
            var newBoard = TicTacToeEngine.AddSecondPlayer(new Player
            {
                Uuid = uuid,
                ConnectionId = Context.ConnectionId,
                Name = name
            }, board);
            await cache.SaveBoardAsync(uuid, newBoard);

            await Clients.Client(newBoard.firstPlayer.ConnectionId).SendAsync("opponentName", newBoard.firstPlayer.Name);
            await Clients.Client(newBoard.secondPlayer.ConnectionId).SendAsync("opponentName", newBoard.secondPlayer.Name);
        }

        public async Task StartGame(string roomUuid)
        {
            var board = await cache.GetBoardAsync(roomUuid);
            await Clients.Client(board.firstPlayer.ConnectionId).SendAsync("startGame");
            await Clients.Client(board.secondPlayer.ConnectionId).SendAsync("starGame");
        }

        public async Task SendMark(int i, int j)
        {
            var gameKey = "asd";
            var board = await cache.GetBoardAsync(gameKey);
            if (board == null)
            {
                board = TicTacToeEngine.InitializeBoard(
                     new Player { ConnectionId = "qwe", Name = "asd" }
                 );
            }

            board = TicTacToeEngine.AddMark("qwe", i, j, board);

            await cache.SaveBoardAsync(gameKey, board);
            await Clients.All.SendAsync("broadcastBoardStatus", board.grid);
        }
    }
}
