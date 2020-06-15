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

        public async Task GetPlayerUuid()
        {
            //todo: consider encoding this in a jwt token
            var uuid = Guid.NewGuid().ToString();
            await Clients.Caller.SendAsync("playerUuid", uuid);
        }

        public async Task CreateRoom(Player player)
        {
            var board = TicTacToeEngine.InitializeBoard(
                 new Player
                 {
                     Uuid = player.Uuid,
                     ConnectionId = Context.ConnectionId,
                     Name = player.Name
                 }
            );
            await cache.SaveBoardAsync(player.Uuid, board);
            await Clients.Caller.SendAsync("board", board);
        }

        public async Task JoinRoom(Player player, string roomUuid)
        {
            var board = await cache.GetBoardAsync(roomUuid);
            if (board == null)
            {
                await Clients.Caller.SendAsync("error", "room not found");
            }

            var newBoard = TicTacToeEngine.AddSecondPlayer(new Player
            {
                Uuid = player.Uuid,
                ConnectionId = Context.ConnectionId,
                Name = player.Name
            }, board);
            await cache.SaveBoardAsync(roomUuid, newBoard);

            await Clients.Client(newBoard.FirstPlayer.ConnectionId).SendAsync("board", newBoard);
            await Clients.Client(newBoard.SecondPlayer.ConnectionId).SendAsync("board", newBoard);
        }

        public async Task GetBoard(string roomUuid)
        {
            var board = await cache.GetBoardAsync(roomUuid);
            await Clients.Caller.SendAsync("board", board);
        }

        public async Task StartGame(string roomUuid)
        {
            var board = await cache.GetBoardAsync(roomUuid);
            await Clients.Client(board.FirstPlayer.ConnectionId).SendAsync("startGame");
            await Clients.Client(board.SecondPlayer.ConnectionId).SendAsync("starGame");
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
            await Clients.All.SendAsync("broadcastBoardStatus", board.Grid);
        }
    }
}
